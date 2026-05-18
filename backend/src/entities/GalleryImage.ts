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

import { GalleryEvent } from "./GalleryEvent";

@Entity("gallery_images")
export class GalleryImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "event_id" })
  @Index()
  eventId!: number;

  @Column({
    type: "varchar",
    length: 500,
  })
  imageUrl!: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  altText!: string | null;

  @ManyToOne(() => GalleryEvent, (event) => event.galleryImages, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "event_id" })
  event!: GalleryEvent;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}