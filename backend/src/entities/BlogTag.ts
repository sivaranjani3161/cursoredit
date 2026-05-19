import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import { Blog } from "./Blog";
import { Tag } from "./Tag";

@Entity("blog_tags")
export class BlogTag {
  @PrimaryColumn({ name: "blog_id" })
  blogId!: number;

  @PrimaryColumn({ name: "tag_id" })
  tagId!: number;

  @ManyToOne(() => Blog, (blog) => blog.blogTags, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "blog_id" })
  blog!: Blog;

  @ManyToOne(() => Tag, (tag) => tag.blogTags, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "tag_id" })
  tag!: Tag;

  @CreateDateColumn()
  createdAt!: Date;
}