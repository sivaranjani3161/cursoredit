import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm";
import { GalleryImage } from "./GalleryImage";
import { User } from "./User";

@Entity("gallery_events")
export class GalleryEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  location!: string | null;

  @Column({ type: "varchar", length: 255, unique: true })
  slug!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  coverImage!: string | null;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "date", nullable: true })
  eventDate!: Date | null;

  @Column()
  @Index()
  createdBy!: number;

@ManyToOne(() => User, (user) => user.galleryEvents, {
  onDelete: "CASCADE",
})
@JoinColumn({ name: "created_by" })
createdByUser!: User;

  @OneToMany(() => GalleryImage, (image) => image.event)
  galleryImages!: GalleryImage[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
