import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm";
import { BlogStatus } from "./enums/BlogStatus";
import { BlogTag } from "./BlogTag";
import { RelatedBlog } from "./RelatedBlog";
import { User } from "./User";

@Entity("blogs")
export class Blog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug!: string;

  @Column({ type: "text", nullable: true })
  excerpt!: string | null;

  @Column({ type: "longtext" })
  content!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  coverImage!: string | null;

  @Column({ type: "datetime", nullable: true })
  publishedAt!: Date | null;

  @Column({ type: "enum", enum: BlogStatus, default: BlogStatus.DRAFT })
  status!: BlogStatus;

  @Column()
  @Index()
  createdBy!: number;

 @ManyToOne(() => User, (user) => user.blogs, {
  onDelete: "CASCADE",
})
@JoinColumn({ name: "created_by" })
createdByUser!: User;

  @OneToMany(() => BlogTag, (blogTag) => blogTag.blog)
  blogTags!: BlogTag[];

  @OneToMany(() => RelatedBlog, (relatedBlog) => relatedBlog.blog)
  relatedBlogs!: RelatedBlog[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
