import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm";
import { CourseHighlight } from "./CourseHighlight";
import { CourseStructure } from "./CourseStructure";
import { CourseFeature } from "./CourseFeature";
import { Enquiry } from "./Enquiry";
import { User } from "./User";
import { CourseCategory } from "./CourseCategory";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  heroImage!: string | null;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ name: "category_id", type: "int", nullable: true })
  categoryId!: number | null;

  @ManyToOne(() => CourseCategory, (cat) => cat.courses, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "category_id" })
  category!: CourseCategory | null;

  @Column({ name: "created_by" })
  @Index()
  createdBy!: number;

 @ManyToOne(() => User, (user) => user.courses, {
  onDelete: "CASCADE",
})
  @JoinColumn({ name: "created_by" })
createdByUser!: User;

  @OneToMany(() => CourseHighlight, (highlight) => highlight.course, { cascade: true })
  courseHighlights!: CourseHighlight[];

  @OneToMany(() => CourseStructure, (structure) => structure.course, { cascade: true })
  courseStructure!: CourseStructure[];

  @OneToMany(() => CourseFeature, (feature) => feature.course, { cascade: true })
  courseFeatures!: CourseFeature[];

  @OneToMany(() => Enquiry, (enquiry) => enquiry.course)
  enquiries!: Enquiry[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
