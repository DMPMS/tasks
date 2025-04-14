import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CATEGORY } from "../config/constants";
import { UserEntity } from "./userEntity";
import { TaskEntity } from "./taskEntity";

@Entity("category")
export class CategoryEntity {
  @PrimaryGeneratedColumn("rowid")
  id!: number;

  @Column({ type: "integer", name: "user_id", nullable: false })
  userId!: number;

  @Column({
    type: "varchar",
    name: "name",
    length: CATEGORY.NAME_LENGTH.MAX,
    nullable: false,
  })
  name!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.categories)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: UserEntity;

  @OneToMany(() => TaskEntity, (task) => task.category)
  tasks?: TaskEntity[];
}
