import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { Company } from '../entities/company.entity';

@ApiTags('Companies')
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Créer une nouvelle entreprise',
    description: 'Permet de créer une nouvelle entreprise sur la plateforme. Le mot de passe est optionnel et sera généré automatiquement puis envoyé par email.'
  })
  @ApiResponse({ status: 201, description: 'Entreprise créée avec succès', type: Company })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Récupérer toutes les entreprises',
    description: 'Liste toutes les entreprises de la plateforme'
  })
  @ApiResponse({ status: 200, description: 'Liste des entreprises', type: [Company] })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer une entreprise par ID',
    description: 'Récupère les détails d\'une entreprise spécifique'
  })
  @ApiResponse({ status: 200, description: 'Entreprise trouvée', type: Company })
  @ApiResponse({ status: 404, description: 'Entreprise non trouvée' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Mettre à jour une entreprise',
    description: 'Met à jour les informations d\'une entreprise'
  })
  @ApiResponse({ status: 200, description: 'Entreprise mise à jour avec succès', type: Company })
  @ApiResponse({ status: 404, description: 'Entreprise non trouvée' })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Supprimer une entreprise',
    description: 'Supprime une entreprise de la plateforme'
  })
  @ApiResponse({ status: 200, description: 'Entreprise supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Entreprise non trouvée' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ 
    summary: 'Activer/Désactiver une entreprise',
    description: 'Bascule le statut actif/inactif d\'une entreprise'
  })
  @ApiResponse({ status: 200, description: 'Statut modifié avec succès', type: Company })
  @ApiResponse({ status: 404, description: 'Entreprise non trouvée' })
  toggleActive(@Param('id') id: string) {
    return this.companiesService.toggleActive(id);
  }

  @Patch(':id/reset-password')
  @ApiOperation({ 
    summary: 'Réinitialiser le mot de passe d\'une entreprise',
    description: 'Génère un nouveau mot de passe et l\'envoie par email'
  })
  @ApiResponse({ status: 200, description: 'Mot de passe réinitialisé avec succès', type: Company })
  @ApiResponse({ status: 404, description: 'Entreprise non trouvée' })
  resetPassword(@Param('id') id: string) {
    return this.companiesService.resetPassword(id);
  }

  @Post('test-email')
  @ApiOperation({ 
    summary: 'Tester la configuration email',
    description: 'Teste la configuration SMTP et envoie un email de test'
  })
  @ApiResponse({ status: 200, description: 'Test email réussi' })
  @ApiResponse({ status: 500, description: 'Erreur de configuration email' })
  async testEmail() {
    try {
      const testEmail = 'test@example.com';
      const testName = 'Test Company';
      const testPassword = 'TestPassword123!';
      
      await this.companiesService['emailService'].sendWelcomeEmail(testEmail, testName, testPassword);
      
      return {
        success: true,
        message: 'Configuration email valide - Email de test envoyé avec succès',
        testEmail,
        testPassword
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur de configuration email',
        error: error.message,
        suggestion: 'Vérifiez vos variables d\'environnement SMTP_USERNAME et SMTP_PASSWORD'
      };
    }
  }

  @Post('test-email-config')
  @ApiOperation({ 
    summary: 'Tester la configuration email uniquement',
    description: 'Teste uniquement la configuration SMTP sans envoyer d\'email'
  })
  @ApiResponse({ status: 200, description: 'Configuration testée' })
  async testEmailConfig() {
    try {
      const isConfigured = await this.companiesService['emailService'].testConnection();
      
      return {
        success: isConfigured,
        message: isConfigured ? 'Configuration email valide' : 'Configuration email invalide',
        smtpUsername: process.env.SMTP_USERNAME ? 'Configuré' : 'Non configuré',
        smtpPassword: process.env.SMTP_PASSWORD ? 'Configuré' : 'Non configuré'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors du test de configuration',
        error: error.message
      };
    }
  }
} 