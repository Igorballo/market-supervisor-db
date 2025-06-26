import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company, CompanyRole } from '../entities/company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { EmailService } from '../email/email.service';
import { generateSecurePassword } from '../utils/password.utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    private emailService: EmailService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    console.log(createCompanyDto);
    const { email, name, country, sector, website, telephone } = createCompanyDto;

    // Vérifier si l'entreprise existe déjà
    const existingCompany = await this.companiesRepository.findOne({
      where: { email },
    });

    if (existingCompany) {
      throw new ConflictException('Une entreprise avec cet email existe déjà');
    }

    // Générer un mot de passe si non fourni
    const finalPassword = generateSecurePassword();

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    // Créer l'entreprise
    const company = this.companiesRepository.create({
      email,
      password: hashedPassword,
      name,
      country,
      sector,
      role: CompanyRole.COMPANY,
      website,
      telephone,
    });

    const savedCompany = await this.companiesRepository.save(company);

    // Envoyer l'email avec les identifiants
    try {
      await this.emailService.sendWelcomeEmail(email, name, finalPassword);
      console.log(`✅ Email envoyé avec succès à ${email}`);
    } catch (error) {
      // Log l'erreur mais ne pas faire échouer la création de l'entreprise
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error.message);
      console.log('📧 Identifiants générés (à envoyer manuellement):');
      console.log(`   Email: ${email}`);
      console.log(`   Mot de passe: ${finalPassword}`);
    }

    return savedCompany;
  }

  async findAll(): Promise<Company[]> {
    return this.companiesRepository.find({
      select: ['id', 'name', 'email', 'country', 'sector', 'role', 'isActive', 'createdAt'],
    });
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'country', 'sector', 'role', 'isActive', 'createdAt'],
    });

    if (!company) {
      throw new NotFoundException('Entreprise non trouvée');
    }

    return company;
  }

  async findByEmail(email: string): Promise<Company> {
    return this.companiesRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);

    if (updateCompanyDto.password) {
      updateCompanyDto.password = await bcrypt.hash(updateCompanyDto.password, 10);
    }

    Object.assign(company, updateCompanyDto);
    return this.companiesRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    await this.companiesRepository.remove(company);
  }

  async toggleActive(id: string): Promise<Company> {
    const company = await this.findOne(id);
    company.isActive = !company.isActive;
    return this.companiesRepository.save(company);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    const hashedRefreshToken = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
    await this.companiesRepository.update(id, {
      refreshToken: hashedRefreshToken,
    });
  }

  async resetPassword(id: string): Promise<Company> {
    const company = await this.findOne(id);
    
    // Générer un nouveau mot de passe
    const newPassword = generateSecurePassword();
    
    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Mettre à jour le mot de passe
    company.password = hashedPassword;
    const updatedCompany = await this.companiesRepository.save(company);
    
    // Envoyer l'email avec le nouveau mot de passe
    try {
      await this.emailService.sendPasswordResetEmail(company.email, company.name, newPassword);
      console.log(`✅ Email de réinitialisation envoyé avec succès à ${company.email}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de réinitialisation:', error.message);
      console.log('📧 Nouveau mot de passe généré (à envoyer manuellement):');
      console.log(`   Email: ${company.email}`);
      console.log(`   Nouveau mot de passe: ${newPassword}`);
    }
    
    return updatedCompany;
  }
} 