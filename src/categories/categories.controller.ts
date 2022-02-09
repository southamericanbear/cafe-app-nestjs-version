import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
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

  @Get('/:id')
  getCategoryById(@Param('id') id: string, @Res() res): Promise<Category> {
    return this.categoriesService.getCategoryById(id, res);
  }

  @Patch('/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res,
  ): Promise<void> {
    const { name } = createCategoryDto;
    return this.categoriesService.updateCategory(id, name, res);
  }

  @Post()
  createCategory(
    @Res() res,
    @Body() createCategoryDto: CreateCategoryDto,
    //in the future add the connection with the User
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto, res);
  }

  @Delete('/:id')
  deleteCategory(@Param('id') id: string, @Res() res): Promise<void> {
    return this.categoriesService.deleteCategory(id, res);
  }
}
