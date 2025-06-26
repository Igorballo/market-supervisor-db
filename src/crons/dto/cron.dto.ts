import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCronDto {
  @ApiProperty({ 
    example: 'Surveillance Google',
    description: 'Nom du cron'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: 'Surveillance quotidienne des résultats Google pour notre entreprise',
    description: 'Description du cron',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    example: ['google', 'surveillance', 'quotidien'],
    description: 'Tags associés au cron'
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ 
    example: 'google, surveillance, quotidien',
    description: 'Mots clés associés au cron',
    required: false
  })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiProperty({ 
    example: true,
    description: 'Statut actif/inactif du cron',
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de l\'entreprise propriétaire du cron'
  })
  @IsString()
  @IsNotEmpty()
  companyId: string;
}

export class UpdateCronDto {
  @ApiProperty({ 
    example: 'Surveillance Google Modifiée',
    description: 'Nom du cron'
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ 
    example: 'Surveillance quotidienne des résultats Google pour notre entreprise - Version mise à jour',
    description: 'Description du cron'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    example: ['google', 'surveillance', 'quotidien', 'mise-a-jour'],
    description: 'Tags associés au cron'
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ 
    example: false,
    description: 'Statut actif/inactif du cron'
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CronResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  lastRunAt: Date;

  @ApiProperty()
  searchCount: number;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 