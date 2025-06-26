import { IsEmail, IsString, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyRole } from '../../entities/company.entity';

export class LoginDto {
  @ApiProperty({ 
    example: 'company@example.com',
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

export class RegisterDto {
  @ApiProperty({ 
    example: 'Tech Solutions Inc.',
    description: 'Nom de l\'entreprise'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: 'company@example.com',
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
    enum: CompanyRole,
    default: CompanyRole.COMPANY,
    description: 'Rôle de l\'entreprise'
  })
  @IsEnum(CompanyRole)
  role?: CompanyRole;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token pour renouveler l\'accès'
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
} 