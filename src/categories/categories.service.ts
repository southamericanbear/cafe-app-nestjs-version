import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginationCategoryDto } from './dto/pagination-category.dto';

// const populate = {
//   path: 'user',
//   select: ['name', 'email', 'img', 'rol'],
// };
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async getCategories(
    paginationCategoryDto: PaginationCategoryDto,
    res,
  ): Promise<Category[]> {
    const { from = 0, limit = 5 } = paginationCategoryDto;
    const query = { state: true };

    try {
      const [total, categories] = await Promise.all([
        this.categoryModel.countDocuments(query),
        this.categoryModel.find(query).skip(Number(from)).limit(Number(limit)),
        //.populate(populate),
      ]);

      res.status(200).json({
        total,
        categories,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        msg: 'An error occurred, please check the logs',
      });
    }

    return this.categoryModel.find();
  }

  async getCategoryById(id: string, res): Promise<Category> {
    const categoryDB = await this.categoryModel.findById(id);
    if (categoryDB && !categoryDB.state) {
      return res.status(400).json({
        msg: `Category ${categoryDB.name} is not available`,
      });
    }

    if (!categoryDB) {
      return res.status(404).json({
        msg: "Category doesn't exists",
      });
    }

    try {
      //Needs to populate in the future
      const result = await this.categoryModel.findById(id);
      res.status(200).json({
        result,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateCategory(id: string, name: string, res) {
    if (!name.length || name.length < 3) {
      return res.status(400).json({
        msg: 'Name should be at least 3 characters long',
      });
    }

    const categoryDB = await this.categoryModel.findOne({
      name: name.toUpperCase(),
    });

    if (categoryDB && categoryDB.state) {
      return res.status(400).json({
        msg: `Category ${name} already exists`,
      });
    }

    try {
      await this.categoryModel.findByIdAndUpdate(id, {
        name: name.toUpperCase(),
      });

      res.status(200).json({
        msg: 'Category updated',
      });
    } catch (error) {
      console.log(error);
    }
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

  async deleteCategory(id: string, res): Promise<void> {
    try {
      await this.categoryModel.findByIdAndUpdate(id, { state: false });
      return res.status(200).json({ msg: 'Category successfully deleted' });
    } catch (error) {
      console.log(error);
    }
  }
}
