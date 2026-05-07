import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { User } from "./User";

@Entity("refresh_tokens")
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id!: number;

 @Column({
  type: "varchar",
  length: 512,
  unique: true,
  select: false,
})
token!: string;

  @Column()
  @Index()
  userId!: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "datetime" })
  expiresAt!: Date;

  @Column({ type: "boolean", default: false })
  isRevoked!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
