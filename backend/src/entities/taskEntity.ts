import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TASK } from "../config/constants";
import { UserEntity } from "./userEntity";
import { PriorityEnum } from "../enums/PriorityEnum";
import { CategoryEntity } from "./categoryEntity";

@Entity("task")
export class TaskEntity {
  @PrimaryGeneratedColumn("rowid")
  id!: number;

  @Column({ name: "user_id", nullable: false })
  userId!: number;

  @Column({ name: "category_id", nullable: true })
  categoryId!: number;

  @Column({ name: "title", length: TASK.TITLE_LENGTH.MAX, nullable: false })
  title!: string;

  @Column({ name: "description", nullable: true })
  description?: string;

  @Column({
    name: "priority",
    type: "enum",
    enum: PriorityEnum,
    nullable: false,
  })
  priority!: PriorityEnum;

  @Column({ name: "completed_date", nullable: true })
  completedDate?: Date;

  @Column({ name: "limit_date", nullable: false })
  limitDate!: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.tasks)
  @JoinColumn({ name: "category_id", referencedColumnName: "id" })
  category?: CategoryEntity;
}
