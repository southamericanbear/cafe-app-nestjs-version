import { IsOptional, IsNumber } from 'class-validator';
export class PaginationCategoryDto {
  @IsOptional()
  @IsNumber()
  from?: number;
  @IsOptional()
  @IsNumber()
  limit?: number;
}
