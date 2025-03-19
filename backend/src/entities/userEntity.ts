import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { USER } from "../config/constants";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("rowid")
  id!: number;

  @Column({ name: "name", length: USER.NAME_LENGTH.MAX, nullable: false })
  name!: string;

  @Column({
    name: "email",
    length: USER.EMAIL_LENGTH.MAX,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    name: "password",
    length: USER.PASSWORD_LENGTH.MAX,
    nullable: false,
  })
  password!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
