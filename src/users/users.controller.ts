import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from '../entities/user.entity';

@ApiTags('Users (Admin)')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Créer un nouvel administrateur',
    description: 'Permet de créer un nouvel utilisateur administrateur'
  })
  @ApiResponse({ status: 201, description: 'Administrateur créé avec succès', type: User })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Récupérer tous les administrateurs',
    description: 'Liste tous les utilisateurs administrateurs'
  })
  @ApiResponse({ status: 200, description: 'Liste des administrateurs', type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer un administrateur par ID',
    description: 'Récupère les détails d\'un administrateur spécifique'
  })
  @ApiResponse({ status: 200, description: 'Administrateur trouvé', type: User })
  @ApiResponse({ status: 404, description: 'Administrateur non trouvé' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Mettre à jour un administrateur',
    description: 'Met à jour les informations d\'un administrateur'
  })
  @ApiResponse({ status: 200, description: 'Administrateur mis à jour avec succès', type: User })
  @ApiResponse({ status: 404, description: 'Administrateur non trouvé' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Supprimer un administrateur',
    description: 'Supprime un administrateur de la plateforme'
  })
  @ApiResponse({ status: 200, description: 'Administrateur supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Administrateur non trouvé' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ 
    summary: 'Activer/Désactiver un administrateur',
    description: 'Bascule le statut actif/inactif d\'un administrateur'
  })
  @ApiResponse({ status: 200, description: 'Statut modifié avec succès', type: User })
  @ApiResponse({ status: 404, description: 'Administrateur non trouvé' })
  toggleActive(@Param('id') id: string) {
    return this.usersService.toggleActive(id);
  }
} 