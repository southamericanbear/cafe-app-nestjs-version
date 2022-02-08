import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginationCategoryDto } from './dto/pagination-category.dto';
import { Category } from './schema/category.schema';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getCategories(
    @Res() res,
    @Query() paginationCategoryDto: PaginationCategoryDto,
  ): Promise<Category[]> {
    return this.categoriesService.getCategories(paginationCategoryDto, res);
  }

  @Post()
  createCategory(
    @Res() res,
    @Body() createCategoryDto: CreateCategoryDto,
    //in the future add the connection with the User
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto, res);
  }
}
