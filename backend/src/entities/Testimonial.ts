import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { User } from "./User";
import { TestimonialType } from "./enums/TestimonialType";

@Entity("testimonials")
export class Testimonial {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
  type: "enum",
  enum: TestimonialType,
})
type!: TestimonialType;

  @Column({ type: "varchar", length: 500, nullable: true })
  videoUrl!: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  thumbnailUrl!: string | null;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  role!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  company!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  title!: string | null;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "int", default: 0 })
  sortOrder!: number;

  @Column()
  @Index()
  createdBy!: number;

  @ManyToOne(() => User, (user) => user.testimonials)
  @JoinColumn({ name: "created_by" })
  createdByUser!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
