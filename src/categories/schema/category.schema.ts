import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({
    required: [true, 'name is required'],
    unique: true,
  })
  name: string;
  @Prop({
    required: true,
    default: true,
  })
  state: boolean;
  // for the cases below check again the documentation to declare the types of the references in the Prop() decorator
  //   user: {
  //     type: Schema.Types.ObjectId,
  //     ref: "Users",
  //     required: true,
  //   },
  //   products: [
  //     {
  //       type: Schema.Types.ObjectId,
  //       ref: "Product",
  //     },
  //]
}

export const CategorySchema = SchemaFactory.createForClass(Category);
