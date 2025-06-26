import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronsService } from './crons.service';
import { GoogleSearchService } from '../search/google-search.service';
import { SearchResultsService } from '../search/search-results.service';
import { CreateSearchResultDto } from '../search/dto/search-result.dto';

@Injectable()
export class CronExecutorService {
  private readonly logger = new Logger(CronExecutorService.name);

  constructor(
    private readonly cronsService: CronsService,
    private readonly googleSearchService: GoogleSearchService,
    private readonly searchResultsService: SearchResultsService,
  ) {}

  // Exécution quotidienne à 9h00
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async executeDailyCrons() {
    this.logger.log('🚀 Début de l\'exécution des crons quotidiens');
    await this.executeCronsByFrequency('daily');
  }

  // Exécution hebdomadaire le lundi à 9h00
  @Cron('0 9 * * 1')
  async executeWeeklyCrons() {
    this.logger.log('🚀 Début de l\'exécution des crons hebdomadaires');
    await this.executeCronsByFrequency('weekly');
  }

  // Exécution bi-hebdomadaire le lundi et jeudi à 9h00
  @Cron('0 9 * * 1,4')
  async executeBiweeklyCrons() {
    this.logger.log('🚀 Début de l\'exécution des crons bi-hebdomadaires');
    await this.executeCronsByFrequency('biweekly');
  }

  // Exécution mensuelle le premier jour du mois à 9h00
  @Cron('0 9 1 * *')
  async executeMonthlyCrons() {
    this.logger.log('🚀 Début de l\'exécution des crons mensuels');
    await this.executeCronsByFrequency('monthly');
  }

  private async executeCronsByFrequency(frequency: string) {
    try {
      // Récupérer tous les crons actifs pour cette fréquence
      const crons = await this.cronsService.getCronsByFrequency(frequency);
      
      this.logger.log(`📋 ${crons.length} crons trouvés pour la fréquence: ${frequency}`);

      for (const cron of crons) {
        try {
          await this.executeCron(cron);
        } catch (error) {
          this.logger.error(`❌ Erreur lors de l'exécution du cron ${cron.name}:`, error.message);
        }
      }
    } catch (error) {
      this.logger.error(`❌ Erreur lors de l'exécution des crons ${frequency}:`, error.message);
    }
  }

  async executeCron(cron: any): Promise<void> {
    this.logger.log(`🔍 Exécution du cron: ${cron.name} (ID: ${cron.id})`);

    try {
      // Effectuer la recherche Google avec les mots-clés du cron
      const searchResults = await this.googleSearchService.search(cron.keywords);
      
      this.logger.log(`📊 ${searchResults.length} résultats trouvés pour le cron ${cron.name}`);

      if (searchResults.length > 0) {
        // Préparer les résultats pour la sauvegarde
        const resultsToSave: CreateSearchResultDto[] = searchResults.map(result => ({
          ...result,
          cronId: cron.id,
        }));

        // Sauvegarder les résultats dans la base de données
        await this.searchResultsService.createMany(resultsToSave);
        
        this.logger.log(`💾 ${resultsToSave.length} résultats sauvegardés pour le cron ${cron.name}`);
      }

      // Mettre à jour les statistiques du cron
      await this.cronsService.updateLastRun(cron.id);
      
      this.logger.log(`✅ Cron ${cron.name} exécuté avec succès`);
    } catch (error) {
      this.logger.error(`❌ Erreur lors de l'exécution du cron ${cron.name}:`, error.message);
      throw error;
    }
  }

  // Méthode pour exécuter un cron manuellement
  async executeCronManually(cronId: string): Promise<void> {
    const cron = await this.cronsService.findOne(cronId);
    
    if (!cron.isActive) {
      throw new Error(`Le cron ${cron.name} n'est pas actif`);
    }

    await this.executeCron(cron);
  }

  // Méthode pour exécuter tous les crons actifs (pour les tests)
  async executeAllActiveCrons(): Promise<void> {
    this.logger.log('🚀 Exécution manuelle de tous les crons actifs');
    
    const activeCrons = await this.cronsService.getActiveCrons();
    
    for (const cron of activeCrons) {
      try {
        await this.executeCron(cron);
      } catch (error) {
        this.logger.error(`❌ Erreur lors de l'exécution du cron ${cron.name}:`, error.message);
      }
    }
  }
} 