import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { AdminRole } from "../../common/admin-role";

@Entity("admin_users")
export class AdminUserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index({ unique: true })
  @Column()
  email!: string;

  @Index({ unique: true, where: '"phoneNumber" IS NOT NULL' })
  @Column({ nullable: true })
  phoneNumber?: string;

  @Column()
  passwordHash!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ type: "varchar" })
  role!: AdminRole;

  @Column({ default: true })
  active!: boolean;

  @Column({ type: "timestamptz", nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}
