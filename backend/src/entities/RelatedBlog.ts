import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import { Blog } from "./Blog";

@Entity("related_blogs")
export class RelatedBlog {
  @PrimaryColumn({ name: "blog_id" })
  blogId!: number;

  @PrimaryColumn({ name: "related_blog_id" })
  relatedBlogId!: number;

  @ManyToOne(() => Blog, (blog) => blog.relatedBlogs, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "blog_id" })
  blog!: Blog;

  @ManyToOne(() => Blog, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "related_blog_id" })
  relatedBlog!: Blog;

  @CreateDateColumn()
  createdAt!: Date;
}