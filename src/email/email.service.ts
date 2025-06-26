import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, companyName: string, password: string): Promise<void> {
    const loginUrl = process.env.FRONTEND_URL || 'http://localhost:3000/login';
    
    const htmlContent = `
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
          
          <p>Vous pouvez maintenant vous connecter à votre espace en cliquant sur le lien ci-dessous :</p>
          
          <a href="${loginUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Se connecter</a>
          
          <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
          
          <p>Cordialement,<br>
          L'équipe Market Supervisor</p>
        </div>
      </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Bienvenue sur Market Supervisor - Vos identifiants de connexion',
      html: htmlContent,
    });
  }

  async sendPasswordResetEmail(email: string, companyName: string, newPassword: string): Promise<void> {
    const loginUrl = process.env.FRONTEND_URL || 'http://localhost:3000/login';
    
    const htmlContent = `
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
          
          <p>Vous pouvez maintenant vous connecter à votre espace en cliquant sur le lien ci-dessous :</p>
          
          <a href="${loginUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Se connecter</a>
          
          <p>Si vous n'avez pas demandé cette réinitialisation, veuillez nous contacter immédiatement.</p>
          
          <p>Cordialement,<br>
          L'équipe Market Supervisor</p>
        </div>
      </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Réinitialisation de mot de passe - Market Supervisor',
      html: htmlContent,
    });
  }
} 