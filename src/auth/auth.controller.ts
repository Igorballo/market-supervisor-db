import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, RefreshTokenDto } from './dto/auth.dto';
import { LoginUserDto } from '../users/dto/user.dto';
import { LoginCompanyDto } from '../companies/dto/company.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Authentification des entreprises
  @Post('companies/register')
  @ApiOperation({ 
    summary: 'Inscription d\'une nouvelle entreprise',
    description: 'Permet à une entreprise de s\'inscrire sur la plateforme'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Entreprise créée avec succès'
  })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async registerCompany(@Body() registerDto: RegisterDto) {
    return this.authService.registerCompany(registerDto);
  }

  @Post('companies/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Connexion d\'une entreprise',
    description: 'Permet à une entreprise de se connecter à la plateforme'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Connexion réussie'
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async loginCompany(@Body() loginDto: LoginCompanyDto) {
    return this.authService.loginCompany(loginDto);
  }

  // Authentification des utilisateurs (admin)
  @Post('users/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Connexion d\'un administrateur',
    description: 'Permet à un administrateur de se connecter à la plateforme'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Connexion réussie'
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async loginUser(@Body() loginDto: LoginUserDto) {
    return this.authService.loginUser(loginDto);
  }

  // Logout et refresh communs
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Déconnexion',
    description: 'Déconnecte l\'utilisateur/entreprise et invalide le refresh token'
  })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async logout(@Request() req) {
    const entityType = req.user.type; // 'company' ou 'user'
    return this.authService.logout(req.user.sub, entityType);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Renouvellement du token',
    description: 'Renouvelle l\'access token avec le refresh token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tokens renouvelés'
  })
  @ApiResponse({ status: 401, description: 'Token invalide' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
} 