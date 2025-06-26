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
      if (!this.apiKey || !this.cx) {
        console.log("apiKey", this.apiKey);
        console.log("cx", this.cx);
        throw new Error('Google API Key et CX sont requis');
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

      this.logger.log(`Recherche Google effectuée pour: "${query}" - ${data.items?.length || 0} résultats`);

      return (data.items || []).map(item => ({
        title: item.title,
        summary: item.snippet,
        url: item.link,
        source: 'google',
        searchDate: new Date(),
      }));
    } catch (error) {
      this.logger.error(`Erreur lors de la recherche Google pour "${query}":`, error.message);
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
        throw new Error('Google API Key et CX sont requis');
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

      this.logger.log(`Recherche Google avec options effectuée pour: "${query}" - ${data.items?.length || 0} résultats`);

      return (data.items || []).map(item => ({
        title: item.title,
        summary: item.snippet,
        url: item.link,
        source: 'google',
        searchDate: new Date(),
      }));
    } catch (error) {
      this.logger.error(`Erreur lors de la recherche Google avec options pour "${query}":`, error.message);
      throw error;
    }
  }
} 