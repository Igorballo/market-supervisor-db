import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CronsService } from './crons.service';
import { CronExecutorService } from './cron-executor.service';
import { CreateCronDto, UpdateCronDto } from './dto/cron.dto';
import { Cron } from '../entities/cron.entity';

@ApiTags('Crons')
@ApiBearerAuth()
@Controller('crons')
export class CronsController {
  constructor(
    private readonly cronsService: CronsService,
    private readonly cronExecutorService: CronExecutorService,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Créer un nouveau cron',
    description: 'Permet de créer un nouveau cron pour une entreprise. Une recherche Google sera automatiquement exécutée si des mots-clés sont fournis.'
  })
  @ApiResponse({ status: 201, description: 'Cron créé avec succès', type: Cron })
  @ApiResponse({ status: 409, description: 'Un cron avec ce nom existe déjà pour cette entreprise' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() createCronDto: CreateCronDto) {
    return this.cronsService.create(createCronDto);
  }

//   @Get()
//   @ApiOperation({ 
//     summary: 'Récupérer tous les crons',
//     description: 'Liste tous les crons de la plateforme'
//   })
//   @ApiResponse({ status: 200, description: 'Liste des crons', type: [Cron] })
//   @ApiQuery({ name: 'companyId', required: false, description: 'Filtrer par ID d\'entreprise' })
//   @ApiQuery({ name: 'frequency', required: false, description: 'Filtrer par fréquence' })
//   @ApiQuery({ name: 'active', required: false, description: 'Filtrer par statut actif' })
//   findAll(
//     @Query('companyId') companyId?: string,
//     @Query('frequency') frequency?: string,
//     @Query('active') active?: string,
//   ) {
//     if (companyId) {
//       return this.cronsService.findByCompany(companyId);
//     }
//     if (frequency) {
//       return this.cronsService.getCronsByFrequency(frequency);
//     }
//     if (active === 'true') {
//       return this.cronsService.getActiveCrons();
//     }
//     return this.cronsService.findAll();
//   }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer un cron par ID',
    description: 'Récupère les détails d\'un cron spécifique'
  })
  @ApiResponse({ status: 200, description: 'Cron trouvé', type: Cron })
  @ApiResponse({ status: 404, description: 'Cron non trouvé' })
  findOne(@Param('id') id: string) {
    return this.cronsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Mettre à jour un cron',
    description: 'Met à jour les informations d\'un cron'
  })
  @ApiResponse({ status: 200, description: 'Cron mis à jour avec succès', type: Cron })
  @ApiResponse({ status: 404, description: 'Cron non trouvé' })
  @ApiResponse({ status: 409, description: 'Un cron avec ce nom existe déjà pour cette entreprise' })
  update(@Param('id') id: string, @Body() updateCronDto: UpdateCronDto) {
    return this.cronsService.update(id, updateCronDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Supprimer un cron',
    description: 'Supprime un cron de la plateforme'
  })
  @ApiResponse({ status: 200, description: 'Cron supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Cron non trouvé' })
  remove(@Param('id') id: string) {
    return this.cronsService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ 
    summary: 'Activer/Désactiver un cron',
    description: 'Bascule le statut actif/inactif d\'un cron'
  })
  @ApiResponse({ status: 200, description: 'Statut modifié avec succès', type: Cron })
  @ApiResponse({ status: 404, description: 'Cron non trouvé' })
  toggleActive(@Param('id') id: string) {
    return this.cronsService.toggleActive(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ 
    summary: 'Activer un cron',
    description: 'Active un cron spécifique'
  })
  @ApiResponse({ status: 200, description: 'Cron activé avec succès', type: Cron })
  @ApiResponse({ status: 404, description: 'Cron non trouvé' })
  activate(@Param('id') id: string) {
    return this.cronsService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ 
    summary: 'Désactiver un cron',
    description: 'Désactive un cron spécifique'
  })
  @ApiResponse({ status: 200, description: 'Cron désactivé avec succès', type: Cron })
  @ApiResponse({ status: 404, description: 'Cron non trouvé' })
  deactivate(@Param('id') id: string) {
    return this.cronsService.deactivate(id);
  }

  @Get('company/:companyId')
  @ApiOperation({ 
    summary: 'Récupérer les crons d\'une entreprise',
    description: 'Liste tous les crons d\'une entreprise spécifique'
  })
  @ApiResponse({ status: 200, description: 'Liste des crons de l\'entreprise', type: [Cron] })
  findByCompany(@Param('companyId') companyId: string) {
    return this.cronsService.findByCompany(companyId);
  }

//   @Get('frequency/:frequency')
//   @ApiOperation({ 
//     summary: 'Récupérer les crons par fréquence',
//     description: 'Liste tous les crons actifs d\'une fréquence spécifique'
//   })
//   @ApiResponse({ status: 200, description: 'Liste des crons par fréquence', type: [Cron] })
//   getByFrequency(@Param('frequency') frequency: string) {
//     return this.cronsService.getCronsByFrequency(frequency);
//   }

  @Get('active/list')
  @ApiOperation({ 
    summary: 'Récupérer tous les crons actifs',
    description: 'Liste tous les crons actifs de la plateforme'
  })
  @ApiResponse({ status: 200, description: 'Liste des crons actifs', type: [Cron] })
  getActiveCrons() {
    return this.cronsService.getActiveCrons();
  }

  @Post(':id/execute')
  @ApiOperation({ 
    summary: 'Exécuter un cron manuellement',
    description: 'Exécute un cron spécifique immédiatement'
  })
  @ApiResponse({ status: 200, description: 'Cron exécuté avec succès' })
  @ApiResponse({ status: 404, description: 'Cron non trouvé' })
  async executeCron(@Param('id') id: string) {
    await this.cronExecutorService.executeCronManually(id);
    return {
      message: `Cron exécuté avec succès`,
      cronId: id,
      status: 'completed'
    };
  }

  @Post('execute-all')
  @ApiOperation({ 
    summary: 'Exécuter tous les crons actifs',
    description: 'Exécute tous les crons actifs immédiatement'
  })
  @ApiResponse({ status: 200, description: 'Tous les crons ont été exécutés' })
  async executeAllCrons() {
    await this.cronExecutorService.executeAllActiveCrons();
    return {
      message: 'Tous les crons actifs ont été exécutés',
      status: 'completed'
    };
  }
} 