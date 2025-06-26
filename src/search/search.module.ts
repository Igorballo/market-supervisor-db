import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { GoogleSearchService } from './google-search.service';
import { SearchResultsService } from './search-results.service';
import { SearchResultsController } from './search-results.controller';
import { SearchResult } from '../entities/search-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SearchResult]),
    HttpModule,
  ],
  controllers: [SearchResultsController],
  providers: [GoogleSearchService, SearchResultsService],
  exports: [GoogleSearchService, SearchResultsService],
})
export class SearchModule {} 