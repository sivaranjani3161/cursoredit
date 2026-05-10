import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("awesome_clicks")
export class AwesomeClick {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 500 })
  imageUrl!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  altText!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
