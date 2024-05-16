import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 45})
    description: string;

    @OneToMany(() => User, (user) => user.role)
    user: User[];
}