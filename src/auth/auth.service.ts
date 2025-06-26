import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Company, CompanyRole } from '../entities/company.entity';
import { User, UserRole } from '../entities/user.entity';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto';
import { LoginUserDto } from '../users/dto/user.dto';
import { LoginCompanyDto } from '../companies/dto/company.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Authentification des entreprises
  async registerCompany(registerDto: RegisterDto) {
    // Vérifier si l'entreprise existe déjà
    const existingCompany = await this.companiesRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingCompany) {
      throw new ConflictException('Une entreprise avec cet email existe déjà');
    }

    // Créer l'entreprise
    const newCompany = this.companiesRepository.create({
      ...registerDto,
      role: registerDto.role || CompanyRole.COMPANY,
    });

    const savedCompany = await this.companiesRepository.save(newCompany);

    // Générer les tokens
    const tokens = await this.generateTokens(savedCompany.id, savedCompany.email, 'company');
    await this.updateCompanyRefreshToken(savedCompany.id, tokens.refreshToken);

    return {
      company: {
        id: savedCompany.id,
        email: savedCompany.email,
        name: savedCompany.name,
        country: savedCompany.country,
        sector: savedCompany.sector,
        role: savedCompany.role,
      },
      ...tokens,
    };
  }

  async loginCompany(loginDto: LoginCompanyDto) {
    // Trouver l'entreprise
    const company = await this.companiesRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!company) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      company.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Vérifier si l'entreprise est active
    if (!company.isActive) {
      throw new UnauthorizedException('Compte désactivé');
    }

    // Générer les tokens
    const tokens = await this.generateTokens(company.id, company.email, 'company');
    await this.updateCompanyRefreshToken(company.id, tokens.refreshToken);

    return {
      company: {
        id: company.id,
        email: company.email,
        name: company.name,
        country: company.country,
        sector: company.sector,
        role: company.role,
      },
      ...tokens,
    };
  }

  // Authentification des utilisateurs (admin)
  async loginUser(loginDto: LoginUserDto) {
    // Trouver l'utilisateur
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      throw new UnauthorizedException('Compte désactivé');
    }

    // Générer les tokens
    const tokens = await this.generateTokens(user.id, user.email, 'user');
    await this.updateUserRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async logout(entityId: string, entityType: 'company' | 'user') {
    if (entityType === 'company') {
      await this.updateCompanyRefreshToken(entityId, null);
    } else {
      await this.updateUserRefreshToken(entityId, null);
    }
    return { message: 'Déconnexion réussie' };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      const entityType = payload.type; // 'company' ou 'user'
      let entity;

      if (entityType === 'company') {
        entity = await this.companiesRepository.findOne({
          where: { id: payload.sub },
        });
      } else {
        entity = await this.usersRepository.findOne({
          where: { id: payload.sub },
        });
      }

      if (!entity || !entity.refreshToken) {
        throw new UnauthorizedException('Accès refusé');
      }

      const refreshTokenMatches = await bcrypt.compare(
        refreshTokenDto.refreshToken,
        entity.refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Accès refusé');
      }

      const tokens = await this.generateTokens(entity.id, entity.email, entityType);
      
      if (entityType === 'company') {
        await this.updateCompanyRefreshToken(entity.id, tokens.refreshToken);
      } else {
        await this.updateUserRefreshToken(entity.id, tokens.refreshToken);
      }

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }

  private async generateTokens(entityId: string, email: string, type: 'company' | 'user') {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: entityId,
          email,
          type,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: entityId,
          email,
          type,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateCompanyRefreshToken(companyId: string, refreshToken: string | null) {
    const hashedRefreshToken = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
    await this.companiesRepository.update(companyId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private async updateUserRefreshToken(userId: string, refreshToken: string | null) {
    const hashedRefreshToken = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
    await this.usersRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
} 