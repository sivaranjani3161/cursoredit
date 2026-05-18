import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Course } from "./Course";

@Entity("course_structures")
export class CourseStructure {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "course_id" })
  @Index()
  courseId!: number;

  @Column({
    type: "int",
  })
  phaseNumber!: number;

  @Column({
    type: "varchar",
    length: 255,
  })
  title!: string;

  @Column({
    type: "json",
    nullable: true,
  })
  description!: string[] | null;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  icon!: string | null;

  @Column({
    type: "int",
    default: 0,
  })
  sortOrder!: number;

  @ManyToOne(() => Course, (course) => course.courseStructure, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "course_id" })
  course!: Course;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}