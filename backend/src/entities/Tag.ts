import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { BlogTag } from "./BlogTag";

@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 100,
    unique: true,
  })
  name!: string;

  @Column({
    type: "varchar",
    length: 100,
    unique: true,
  })
  slug!: string;

  @OneToMany(() => BlogTag, (blogTag) => blogTag.tag)
  blogTags!: BlogTag[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}