import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '../entities/cron.entity';
import { CreateCronDto, UpdateCronDto } from './dto/cron.dto';
import { GoogleSearchService } from '../search/google-search.service';
import { SearchResultsService } from '../search/search-results.service';
import { CreateSearchResultDto } from '../search/dto/search-result.dto';

@Injectable()
export class CronsService {
  private readonly logger = new Logger(CronsService.name);
  private readonly pendingCreations = new Set<string>(); // Cache pour éviter les doubles soumissions

  constructor(
    @InjectRepository(Cron)
    private cronsRepository: Repository<Cron>,
    private readonly googleSearchService: GoogleSearchService,
    private readonly searchResultsService: SearchResultsService,
  ) {}

  async create(createCronDto: CreateCronDto): Promise<Cron> {
    const { name, companyId, keywords, requestId } = createCronDto;

    // Protection contre les doubles soumissions avec requestId
    const creationKey = requestId || `create_cron_${name}_${companyId}_${Date.now()}`;
    if (this.pendingCreations.has(creationKey)) {
      throw new ConflictException('Une création de cron est déjà en cours pour cette requête');
    }

    try {
      this.pendingCreations.add(creationKey);

      this.logger.log(`🚀 Début de création du cron: ${name} pour l'entreprise: ${companyId}`);

      // Vérifier si un cron avec le même nom existe déjà pour cette entreprise
      const existingCron = await this.cronsRepository.findOne({
        where: { name, companyId },
      });

      if (existingCron) {
        throw new ConflictException('Un cron avec ce nom existe déjà pour cette entreprise');
      }

      // Créer le cron
      const cron = this.cronsRepository.create({
        ...createCronDto,
        isActive: createCronDto.isActive ?? true,
      });

      const savedCron = await this.cronsRepository.save(cron);
      this.logger.log(`✅ Cron créé avec succès: ${savedCron.name} (ID: ${savedCron.id})`);

      // Exécuter automatiquement une recherche Google si des mots-clés sont fournis
      if (keywords && savedCron.isActive) {
        this.logger.log(`🔍 Mots-clés détectés: "${keywords}" - Lancement de la recherche automatique`);
        
        try {
          this.logger.log(`🔍 Exécution automatique de la recherche pour le nouveau cron: ${savedCron.name}`);
          
          // Effectuer la recherche Google
          const searchResults = await this.googleSearchService.search(keywords);
          
          this.logger.log(`📊 ${searchResults.length} résultats trouvés pour le cron ${savedCron.name}`);

          if (searchResults.length > 0) {
            // Préparer les résultats pour la sauvegarde
            const resultsToSave: CreateSearchResultDto[] = searchResults.map(result => ({
              ...result,
              cronId: savedCron.id,
            }));

            // Sauvegarder les résultats dans la base de données
            await this.searchResultsService.createMany(resultsToSave);
            
            this.logger.log(`💾 ${resultsToSave.length} résultats sauvegardés pour le cron ${savedCron.name}`);
          } else {
            this.logger.warn(`⚠️ Aucun résultat trouvé pour les mots-clés: "${keywords}"`);
          }

          // Mettre à jour les statistiques du cron
          await this.updateLastRun(savedCron.id);
          
          this.logger.log(`✅ Recherche automatique terminée pour le cron ${savedCron.name}`);
        } catch (error) {
          this.logger.error(`❌ Erreur lors de la recherche automatique pour le cron ${savedCron.name}:`, error.message);
          this.logger.error(`   Mots-clés: "${keywords}"`);
          this.logger.error(`   Erreur complète:`, error);
          // Ne pas faire échouer la création du cron si la recherche échoue
        }
      } else {
        if (!keywords) {
          this.logger.log(`ℹ️ Aucun mot-clé fourni pour le cron ${savedCron.name} - Pas de recherche automatique`);
        } else if (!savedCron.isActive) {
          this.logger.log(`ℹ️ Cron ${savedCron.name} inactif - Pas de recherche automatique`);
        }
      }

      return savedCron;
    } finally {
      // Nettoyer le cache après un délai pour permettre les vraies créations
      setTimeout(() => {
        this.pendingCreations.delete(creationKey);
        this.logger.log(`🧹 Cache nettoyé pour la création: ${creationKey}`);
      }, 5000); // 5 secondes de délai
    }
  }

  async findAll(): Promise<Cron[]> {
    return this.cronsRepository.find({
      relations: ['company'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCompany(companyId: string): Promise<Cron[]> {
    return this.cronsRepository.find({
      where: { companyId },
      relations: ['company'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Cron> {
    const cron = await this.cronsRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!cron) {
      throw new NotFoundException('Cron non trouvé');
    }

    return cron;
  }

  async update(id: string, updateCronDto: UpdateCronDto): Promise<Cron> {
    const cron = await this.findOne(id);

    // Si le nom est modifié, vérifier qu'il n'existe pas déjà pour cette entreprise
    if (updateCronDto.name && updateCronDto.name !== cron.name) {
      const existingCron = await this.cronsRepository.findOne({
        where: { name: updateCronDto.name, companyId: cron.companyId },
      });

      if (existingCron) {
        throw new ConflictException('Un cron avec ce nom existe déjà pour cette entreprise');
      }
    }

    // Mettre à jour le cron
    Object.assign(cron, updateCronDto);
    return this.cronsRepository.save(cron);
  }

  async remove(id: string): Promise<void> {
    const cron = await this.findOne(id);
    await this.cronsRepository.remove(cron);
  }

  async toggleActive(id: string): Promise<Cron> {
    const cron = await this.findOne(id);
    cron.isActive = !cron.isActive;
    return this.cronsRepository.save(cron);
  }

  async activate(id: string): Promise<Cron> {
    const cron = await this.findOne(id);
    cron.isActive = true;
    return this.cronsRepository.save(cron);
  }

  async deactivate(id: string): Promise<Cron> {
    const cron = await this.findOne(id);
    cron.isActive = false;
    return this.cronsRepository.save(cron);
  }

  async updateLastRun(id: string): Promise<Cron> {
    const cron = await this.findOne(id);
    cron.lastRunAt = new Date();
    cron.searchCount += 1;
    return this.cronsRepository.save(cron);
  }

  async getActiveCrons(): Promise<Cron[]> {
    return this.cronsRepository.find({
      where: { isActive: true },
      relations: ['company'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCronsByFrequency(frequency: string): Promise<Cron[]> {
    // Pour l'instant, retourner tous les crons actifs car nous n'avons plus l'enum frequency
    // Cette méthode sera utilisée par le scheduler pour exécuter les crons
    return this.cronsRepository.find({
      where: { isActive: true },
      relations: ['company'],
      order: { createdAt: 'DESC' },
    });
  }
} 