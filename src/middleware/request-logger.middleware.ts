import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('RequestLogger');
  private readonly requestLogs = new Map<string, number>();

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = req.headers['x-request-id'] as string || `req_${Date.now()}_${Math.random()}`;
    const method = req.method;
    const url = req.url;
    const userAgent = req.headers['user-agent'];
    const timestamp = new Date().toISOString();

    // Créer une clé unique pour cette requête
    const requestKey = `${method}_${url}_${requestId}`;
    
    // Vérifier si c'est un double appel
    if (this.requestLogs.has(requestKey)) {
      this.logger.warn(`🚨 DOUBLE APPEL DÉTECTÉ: ${method} ${url} - RequestId: ${requestId}`);
      this.logger.warn(`   Premier appel: ${this.requestLogs.get(requestKey)}`);
      this.logger.warn(`   Second appel: ${timestamp}`);
    } else {
      this.requestLogs.set(requestKey, Date.now());
      this.logger.log(`📝 ${method} ${url} - RequestId: ${requestId}`);
    }

    // Nettoyer les anciens logs après 1 minute
    setTimeout(() => {
      this.requestLogs.delete(requestKey);
    }, 60000);

    // Ajouter le requestId à la réponse
    res.setHeader('X-Request-ID', requestId);

    next();
  }
} 