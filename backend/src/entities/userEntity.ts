import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { USER } from "../config/constants";
import { TaskEntity } from "./taskEntity";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { CategoryEntity } from "./categoryEntity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("rowid")
  id!: number;

  @Column({
    type: "varchar",
    name: "name",
    length: USER.NAME_LENGTH.MAX,
    nullable: false,
  })
  name!: string;

  @Column({
    type: "varchar",
    name: "email",
    length: USER.EMAIL_LENGTH.MAX,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: "varchar",
    name: "password",
    length: USER.PASSWORD_LENGTH.MAX,
    nullable: false,
  })
  password!: string;

  @Column({
    type: "integer",
    name: "user_type",
    nullable: false,
  })
  userType!: UserTypeEnum;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks?: TaskEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.user)
  categories?: CategoryEntity[];
}
