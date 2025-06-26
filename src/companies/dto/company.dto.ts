import { IsEmail, IsString, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyRole } from '../../entities/company.entity';

export class CreateCompanyDto {
  @ApiProperty({ 
    example: 'Tech Solutions Inc.',
    description: 'Nom de l\'entreprise'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: 'contact@techsolutions.com',
    description: 'Email de l\'entreprise'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'France',
    description: 'Pays de l\'entreprise'
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ 
    example: 'Technology',
    description: 'Secteur d\'activité'
  })
  @IsString()
  @IsNotEmpty()
  sector: string;

  @ApiProperty({ 
    example: 'https://www.techsolutions.com',
    description: 'Site web de l\'entreprise'
  })
  @IsString()
  @IsNotEmpty()
  website: string;

  @ApiProperty({ 
    example: '+33612345678',
    description: 'Numéro de téléphone de l\'entreprise'
  })
  @IsString()
  @IsNotEmpty()
  telephone: string;

}

export class UpdateCompanyDto {
  @ApiProperty({ 
    example: 'Tech Solutions Inc.',
    description: 'Nom de l\'entreprise'
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ 
    example: 'contact@techsolutions.com',
    description: 'Email de l\'entreprise'
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ 
    example: 'password123',
    description: 'Mot de passe de l\'entreprise'
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ 
    example: 'France',
    description: 'Pays de l\'entreprise'
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ 
    example: 'Technology',
    description: 'Secteur d\'activité'
  })
  @IsString()
  @IsOptional()
  sector?: string;

  @ApiProperty({ 
    example: 'https://www.techsolutions.com',
    description: 'Site web de l\'entreprise'
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ 
    example: '+33612345678',
    description: 'Numéro de téléphone de l\'entreprise'
  })
  @IsString()
  @IsOptional()
  telephone?: string;

  @ApiProperty({ 
    enum: CompanyRole,
    description: 'Rôle de l\'entreprise'
  })
  @IsEnum(CompanyRole)
  @IsOptional()
  role?: CompanyRole;

  @ApiProperty({ 
    description: 'Statut actif/inactif'
  })
  @IsOptional()
  isActive?: boolean;
}

export class LoginCompanyDto {
  @ApiProperty({ 
    example: 'contact@techsolutions.com',
    description: 'Email de l\'entreprise'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'password123',
    description: 'Mot de passe de l\'entreprise'
  })
  @IsString()
  @MinLength(6)
  password: string;
} 