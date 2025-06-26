import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SearchResultsService } from './search-results.service';
import { SearchResult } from '../entities/search-result.entity';

@ApiTags('Search Results')
@ApiBearerAuth()
@Controller('search-results')
export class SearchResultsController {
  constructor(private readonly searchResultsService: SearchResultsService) {}

  @Get('cron/:cronId')
  @ApiOperation({ 
    summary: 'Récupérer les résultats d\'un cron',
    description: 'Liste tous les résultats de recherche d\'un cron spécifique'
  })
  @ApiResponse({ status: 200, description: 'Liste des résultats', type: [SearchResult] })
  findByCron(@Param('cronId') cronId: string) {
    return this.searchResultsService.findByCron(cronId);
  }

  @Get('cron/:cronId/recent')
  @ApiOperation({ 
    summary: 'Récupérer les résultats récents d\'un cron',
    description: 'Liste les résultats récents d\'un cron spécifique'
  })
  @ApiResponse({ status: 200, description: 'Liste des résultats récents', type: [SearchResult] })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre de résultats à retourner', type: Number })
  findRecentByCron(
    @Param('cronId') cronId: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.searchResultsService.findRecentByCron(cronId, limit);
  }

  @Get('cron/:cronId/stats')
  @ApiOperation({ 
    summary: 'Récupérer les statistiques d\'un cron',
    description: 'Retourne les statistiques des résultats d\'un cron'
  })
  @ApiResponse({ status: 200, description: 'Statistiques du cron' })
  getStatsByCron(@Param('cronId') cronId: string) {
    return this.searchResultsService.getStatsByCron(cronId);
  }

  @Get('cron/:cronId/date-range')
  @ApiOperation({ 
    summary: 'Récupérer les résultats d\'un cron par plage de dates',
    description: 'Liste les résultats d\'un cron dans une plage de dates spécifique'
  })
  @ApiResponse({ status: 200, description: 'Liste des résultats par plage de dates', type: [SearchResult] })
  @ApiQuery({ name: 'startDate', required: true, description: 'Date de début (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Date de fin (YYYY-MM-DD)' })
  findByCronAndDateRange(
    @Param('cronId') cronId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.searchResultsService.findByCronAndDateRange(cronId, start, end);
  }
} 