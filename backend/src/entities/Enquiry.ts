import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";

import { EnquiryStatus } from "./enums/EnquiryStatus";
import { Course } from "./Course";

@Entity("enquiries")
export class Enquiry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 255,
  })
  fullName!: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  email!: string;

  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
  })
  phone!: string | null;

  @Column({
    type: "text",
    nullable: true,
  })
  message!: string | null;

  @Column({
    nullable: true,
  })
  @Index()
  courseId!: number | null;

  @ManyToOne(() => Course, (course) => course.enquiries, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "course_id" })
  course!: Course | null;

  @Column({
    type: "enum",
    enum: EnquiryStatus,
    default: EnquiryStatus.NEW,
  })
  status!: EnquiryStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}