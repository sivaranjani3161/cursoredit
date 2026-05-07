import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Role } from "./Role";

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  code!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ name: "role_id" })
  roleId!: number;

  @ManyToOne(() => Role, (role) => role.permissions)
  @JoinColumn({ name: "role_id" })
  role!: Role;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}