import { Model } from 'mongoose';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryModel.find();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    res,
  ): Promise<Category> {
    const name = createCategoryDto.name.toUpperCase();
    const categoryDB = await this.categoryModel.findOne({ name });

    if (categoryDB && categoryDB.state) {
      return res.status(400).json({
        msg: `Category ${createCategoryDto.name} already exists`,
      });
    }

    if (categoryDB) {
      const { _id } = categoryDB;
      try {
        await this.categoryModel.findByIdAndUpdate(_id, { state: true });
        return res.status(200).json({
          msg: `Category ${createCategoryDto.name} is active again`,
        });
      } catch (error) {
        console.log(error);
        res.status(400).json({
          msg: 'An error occurred, check the console',
        });
      }
    }

    const data = {
      name,
    };

    const category = new this.categoryModel(data);

    try {
      await category.save();
      res.status(200).json({
        msg: 'category created',
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        msg: 'An error occurred. please check the logs',
      });
    }
  }
}
