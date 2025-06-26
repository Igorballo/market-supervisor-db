import { IsEmail, IsString, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ 
    example: 'John',
    description: 'Prénom de l\'administrateur'
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ 
    example: 'Doe',
    description: 'Nom de famille de l\'administrateur'
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ 
    example: 'admin@marketsupervisor.com',
    description: 'Email de l\'administrateur'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'password123',
    description: 'Mot de passe de l\'administrateur'
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    enum: UserRole,
    default: UserRole.ADMIN,
    description: 'Rôle de l\'administrateur'
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class UpdateUserDto {
  @ApiProperty({ 
    example: 'John',
    description: 'Prénom de l\'administrateur'
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ 
    example: 'Doe',
    description: 'Nom de famille de l\'administrateur'
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ 
    example: 'admin@marketsupervisor.com',
    description: 'Email de l\'administrateur'
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ 
    example: 'password123',
    description: 'Mot de passe de l\'administrateur'
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ 
    enum: UserRole,
    description: 'Rôle de l\'administrateur'
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ 
    description: 'Statut actif/inactif'
  })
  @IsOptional()
  isActive?: boolean;
}

export class LoginUserDto {
  @ApiProperty({ 
    example: 'admin@marketsupervisor.com',
    description: 'Email de l\'administrateur'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'password123',
    description: 'Mot de passe de l\'administrateur'
  })
  @IsString()
  @MinLength(6)
  password: string;
} 