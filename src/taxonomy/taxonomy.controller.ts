import { Controller, Get } from '@nestjs/common';
import { TaxonomyService } from './taxonomy.service';

@Controller('taxonomy')
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Get('sports')
  async findAllSports() {
    const data = await this.taxonomyService.findAllSports();
    return { data };
  }
}
