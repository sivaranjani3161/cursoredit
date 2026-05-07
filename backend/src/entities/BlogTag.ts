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
  @PrimaryColumn()
  blogId!: number;

  @PrimaryColumn()
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