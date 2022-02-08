import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './schema/category.schema';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getCategories(): Promise<Category[]> {
    return this.categoriesService.getCategories();
  }

  @Post()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    //in the future add the connection with the User
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto);
  }
}
