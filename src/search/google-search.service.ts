import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { SearchResultDto } from './dto/search-result.dto';

@Injectable()
export class GoogleSearchService {
  private readonly logger = new Logger(GoogleSearchService.name);
  private readonly apiKey = process.env.GOOGLE_API_KEY;
  private readonly cx = process.env.GOOGLE_CX;

  constructor(private readonly http: HttpService) {}

  async search(query: string): Promise<SearchResultDto[]> {
    try {
      
      // Vérifier si les clés API sont configurées
      if (!this.apiKey || !this.cx) {
        this.logger.warn(`⚠️ Google API non configurée - Mode simulation activé`);
        this.logger.warn(`   GOOGLE_API_KEY: ${this.apiKey ? '✅ Configuré' : '❌ Manquant'}`);
        this.logger.warn(`   GOOGLE_CX: ${this.cx ? '✅ Configuré' : '❌ Manquant'}`);
        
        if (!this.cx) {
          this.logger.warn(`   💡 Pour configurer GOOGLE_CX, suivez le guide: GOOGLE_API_SETUP.md`);
        }
        
        // Retourner des résultats simulés pour les tests
        return this.generateMockResults(query);
      }

      const url = `https://www.googleapis.com/customsearch/v1`;
      const { data } = await lastValueFrom(
        this.http.get(url, {
          params: {
            key: this.apiKey,
            cx: this.cx,
            q: query,
            num: 10, // Nombre de résultats par défaut
          },
        }),
      );

      this.logger.log(`🔍 Recherche Google effectuée pour: "${query}" - ${data.items?.length || 0} résultats`);

      return (data.items || []).map(item => ({
        title: item.title,
        summary: item.snippet,
        url: item.link,
        source: 'google',
        searchDate: new Date(),
      }));
    } catch (error) {
      this.logger.error(`❌ Erreur lors de la recherche Google pour "${query}":`, error.message);
      
      // Si c'est une erreur 403, c'est probablement un problème de configuration
      if (error.response?.status === 403) {
        this.logger.error(`🔧 Erreur 403 - Vérifiez votre configuration Google API:`);
        this.logger.error(`   1. GOOGLE_API_KEY est-il valide ?`);
        this.logger.error(`   2. GOOGLE_CX est-il correct ?`);
        this.logger.error(`   3. Le quota API est-il dépassé ?`);
        this.logger.error(`   4. L'API Custom Search est-elle activée ?`);
        
        if (!this.cx) {
          this.logger.error(`   🚨 GOOGLE_CX manquant - Créez un moteur de recherche sur: https://programmablesearchengine.google.com/`);
        }
      }
      
      throw error;
    }
  }

  async searchWithOptions(query: string, options: {
    num?: number;
    start?: number;
    dateRestrict?: string;
    sort?: string;
  } = {}): Promise<SearchResultDto[]> {
    try {
      if (!this.apiKey || !this.cx) {
        this.logger.warn(`⚠️ Google API non configurée - Mode simulation activé`);
        return this.generateMockResults(query, options.num);
      }

      const url = `https://www.googleapis.com/customsearch/v1`;
      const { data } = await lastValueFrom(
        this.http.get(url, {
          params: {
            key: this.apiKey,
            cx: this.cx,
            q: query,
            num: options.num || 10,
            start: options.start || 1,
            dateRestrict: options.dateRestrict,
            sort: options.sort,
          },
        }),
      );

      this.logger.log(`🔍 Recherche Google avec options effectuée pour: "${query}" - ${data.items?.length || 0} résultats`);

      return (data.items || []).map(item => ({
        title: item.title,
        summary: item.snippet,
        url: item.link,
        source: 'google',
        searchDate: new Date(),
      }));
    } catch (error) {
      this.logger.error(`❌ Erreur lors de la recherche Google avec options pour "${query}":`, error.message);
      
      if (error.response?.status === 403) {
        this.logger.warn(`🔄 Utilisation du mode simulation en raison de l'erreur API`);
        return this.generateMockResults(query, options.num);
      }
      
      throw error;
    }
  }

  /**
   * Génère des résultats simulés pour les tests
   */
  private generateMockResults(query: string, num: number = 5): SearchResultDto[] {
    this.logger.log(`🎭 Génération de ${num} résultats simulés pour: "${query}"`);
    
    const mockResults: SearchResultDto[] = [];
    const keywords = query.split(',').map(k => k.trim());
    
    for (let i = 1; i <= num; i++) {
      const keyword = keywords[i % keywords.length] || 'recherche';
      mockResults.push({
        title: `Résultat simulé ${i} pour "${keyword}"`,
        summary: `Ceci est un résumé simulé pour la recherche "${query}". Ce résultat a été généré automatiquement car l'API Google n'est pas configurée ou accessible.`,
        url: `https://example.com/mock-result-${i}`,
        source: 'google-simulation',
        searchDate: new Date(),
      });
    }
    
    return mockResults;
  }

  /**
   * Vérifie la configuration de l'API Google
   */
  async checkApiConfiguration(): Promise<{
    configured: boolean;
    apiKey: boolean;
    cx: boolean;
    testResult?: any;
  }> {
    const config: {
      configured: boolean;
      apiKey: boolean;
      cx: boolean;
      testResult?: any;
    } = {
      configured: !!(this.apiKey && this.cx),
      apiKey: !!this.apiKey,
      cx: !!this.cx,
    };

    if (config.configured) {
      try {
        // Test simple de l'API
        const testResults = await this.search('test');
        config.testResult = {
          success: true,
          resultsCount: testResults.length,
        };
      } catch (error) {
        config.testResult = {
          success: false,
          error: error.message,
          status: error.response?.status,
        };
      }
    }

    return config;
  }
} 