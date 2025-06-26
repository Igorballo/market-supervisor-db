import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '../entities/cron.entity';
import { CreateCronDto, UpdateCronDto } from './dto/cron.dto';

@Injectable()
export class CronsService {
  constructor(
    @InjectRepository(Cron)
    private cronsRepository: Repository<Cron>,
  ) {}

  async create(createCronDto: CreateCronDto): Promise<Cron> {
    const { name, companyId, keywords } = createCronDto;

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
      keywords: keywords
    });

    return this.cronsRepository.save(cron);
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

  // async getCronsByFrequency(frequency: string): Promise<Cron[]> {
  //   // Vérifier que la fréquence est valide
  //   if (!Object.values(CronFrequency).includes(frequency as CronFrequency)) {
  //     throw new Error(`Fréquence invalide: ${frequency}`);
  //   }

  //   return this.cronsRepository.find({
  //     where: { frequency: frequency as CronFrequency, isActive: true },
  //     relations: ['company'],
  //     order: { createdAt: 'DESC' },
  //   });
  // }
} 