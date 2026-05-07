import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from "typeorm";

import { Role } from "./Role";
import { UserStatus } from "./enums/UserStatus";

import { Blog } from "./Blog";
import { GalleryEvent } from "./GalleryEvent";
import { Course } from "./Course";
import { Testimonial } from "./Testimonial";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
  })
  email!: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
  })
  name!: string | null;

 @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    select: false,
  })
  password!: string | null;

  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
  })
  authProvider!: string | null;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  oauthId!: string | null;

 

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    nullable: true,
  })
  inviteToken!: string | null;

  @Column({
    type: "datetime",
    nullable: true,
  })
  inviteExpiresAt!: Date | null;

  

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.INVITED,
  })
  status!: UserStatus;

 

  @Column()
  @Index()
  roleId!: number;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: "role_id" })
  role!: Role;

  

  @OneToMany(() => Blog, (blog) => blog.createdByUser)
  blogs!: Blog[];

  @OneToMany(() => GalleryEvent, (event) => event.createdByUser)
  galleryEvents!: GalleryEvent[];

  @OneToMany(() => Course, (course) => course.createdByUser)
  courses!: Course[];

  @OneToMany(() => Testimonial, (testimonial) => testimonial.createdByUser)
  testimonials!: Testimonial[];

 

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}