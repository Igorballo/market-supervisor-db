import { ApiProperty } from '@nestjs/swagger';

export class SearchResultDto {
  @ApiProperty({
    example: 'Titre de l\'article ou de la page',
    description: 'Titre du résultat de recherche'
  })
  title: string;
  

  @ApiProperty({
    example: 'Résumé ou snippet du contenu trouvé...',
    description: 'Résumé du contenu'
  })
  summary: string;

  @ApiProperty({
    example: 'https://example.com/article',
    description: 'URL du résultat'
  })
  url: string;

  @ApiProperty({
    example: 'google',
    description: 'Source de la recherche'
  })
  source: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Date de la recherche'
  })
  searchDate: Date;
}

export class CreateSearchResultDto extends SearchResultDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID du cron associé'
  })
  cronId: string;
} 