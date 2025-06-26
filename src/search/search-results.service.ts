import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchResult } from '../entities/search-result.entity';
import { CreateSearchResultDto } from './dto/search-result.dto';

@Injectable()
export class SearchResultsService {
  private readonly logger = new Logger(SearchResultsService.name);

  constructor(
    @InjectRepository(SearchResult)
    private searchResultsRepository: Repository<SearchResult>,
  ) {}

  async create(createSearchResultDto: CreateSearchResultDto): Promise<SearchResult> {
    const searchResult = this.searchResultsRepository.create(createSearchResultDto);
    return this.searchResultsRepository.save(searchResult);
  }

  async createMany(searchResults: CreateSearchResultDto[]): Promise<SearchResult[]> {
    const entities = searchResults.map(result => this.searchResultsRepository.create(result));
    return this.searchResultsRepository.save(entities);
  }

  async findByCron(cronId: string): Promise<SearchResult[]> {
    return this.searchResultsRepository.find({
      where: { cronId },
      order: { searchDate: 'DESC' },
    });
  }

  async findByCronAndDateRange(cronId: string, startDate: Date, endDate: Date): Promise<SearchResult[]> {
    return this.searchResultsRepository.find({
      where: {
        cronId,
        searchDate: {
          $gte: startDate,
          $lte: endDate,
        } as any,
      },
      order: { searchDate: 'DESC' },
    });
  }

  async findRecentByCron(cronId: string, limit: number = 10): Promise<SearchResult[]> {
    return this.searchResultsRepository.find({
      where: { cronId },
      order: { searchDate: 'DESC' },
      take: limit,
    });
  }

  async deleteOldResults(olderThan: Date): Promise<void> {
    const result = await this.searchResultsRepository.delete({
      searchDate: {
        $lt: olderThan,
      } as any,
    });
    this.logger.log(`Supprimé ${result.affected} anciens résultats de recherche`);
  }

  async getStatsByCron(cronId: string): Promise<{
    totalResults: number;
    lastSearchDate: Date | null;
    averageResultsPerSearch: number;
  }> {
    const results = await this.findByCron(cronId);
    
    if (results.length === 0) {
      return {
        totalResults: 0,
        lastSearchDate: null,
        averageResultsPerSearch: 0,
      };
    }

    const lastSearchDate = results[0].searchDate;
    const totalResults = results.length;
    
    // Grouper par date de recherche pour calculer la moyenne
    const searchesByDate = results.reduce((acc, result) => {
      const dateKey = result.searchDate.toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(result);
      return acc;
    }, {} as Record<string, SearchResult[]>);

    const averageResultsPerSearch = totalResults / Object.keys(searchesByDate).length;

    return {
      totalResults,
      lastSearchDate,
      averageResultsPerSearch: Math.round(averageResultsPerSearch * 100) / 100,
    };
  }
} 