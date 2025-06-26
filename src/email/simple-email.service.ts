import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SimpleEmailService {
  private readonly logger = new Logger(SimpleEmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuration simple pour Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USERNAME || 'your-email@gmail.com',
        pass: process.env.SMTP_PASSWORD || 'your-app-password',
      },
    });
  }

  async sendWelcomeEmail(email: string, companyName: string, password: string): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_USERNAME || 'your-email@gmail.com',
        to: email,
        subject: 'Bienvenue sur Market Supervisor - Vos identifiants de connexion',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
              <h1>Bienvenue sur Market Supervisor</h1>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px;">
              <p>Bonjour,</p>
              
              <p>Nous sommes ravis de vous accueillir sur <strong>Market Supervisor</strong> !</p>
              
              <p>Votre compte entreprise a été créé avec succès. Voici vos identifiants de connexion :</p>
              
              <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Mot de passe :</strong> ${password}</p>
              </div>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>⚠️ Important :</strong> Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe dès votre première connexion.</p>
              </div>
              
              <p>Vous pouvez maintenant vous connecter à votre espace.</p>
              
              <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
              
              <p>Cordialement,<br>
              L'équipe Market Supervisor</p>
            </div>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Email envoyé avec succès à ${email} - Message ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`❌ Erreur lors de l'envoi de l'email à ${email}:`, error.message);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, companyName: string, newPassword: string): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_USERNAME || 'your-email@gmail.com',
        to: email,
        subject: 'Réinitialisation de mot de passe - Market Supervisor',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
              <h1>Réinitialisation de mot de passe</h1>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px;">
              <p>Bonjour ${companyName},</p>
              
              <p>Votre mot de passe a été réinitialisé avec succès.</p>
              
              <p>Voici vos nouveaux identifiants de connexion :</p>
              
              <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Nouveau mot de passe :</strong> ${newPassword}</p>
              </div>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>⚠️ Important :</strong> Pour des raisons de sécurité, nous vous recommandons de changer ce mot de passe dès votre prochaine connexion.</p>
              </div>
              
              <p>Si vous n'avez pas demandé cette réinitialisation, veuillez nous contacter immédiatement.</p>
              
              <p>Cordialement,<br>
              L'équipe Market Supervisor</p>
            </div>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Email de réinitialisation envoyé avec succès à ${email} - Message ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`❌ Erreur lors de l'envoi de l'email de réinitialisation à ${email}:`, error.message);
      throw error;
    }
  }

  // Méthode de test pour vérifier la configuration
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('✅ Configuration email valide');
      return true;
    } catch (error) {
      this.logger.error('❌ Erreur de configuration email:', error.message);
      return false;
    }
  }
} 