import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from 'src/user/user.types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, type: String })
  fName: string | undefined;

  @Prop({ required: true, type: String })
  lName: string | undefined;

  @Prop({ required: true, unique: true, type: String })
  email: string | undefined;

  @Prop({ required: true, type: String })
  password: string | undefined;

  @Prop({ enum: UserRole, default: UserRole.STUDENT, type: String })
  role: UserRole | undefined;
}

export const UserSchema = SchemaFactory.createForClass(User);
