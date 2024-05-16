import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { Catalogue } from "src/modules/catalogue/entities/catalogue.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 120})
    name: string;

    @Column()
    role_id: number;

    @ManyToOne(() => Role, (role) => role.user)
    @JoinColumn({name: 'role_id'})
    role: Role;

    @Column({type: 'varchar', unique: true, length: 200})
    email: string;
    
    @Column({type: 'varchar', length: 100})
    password: string;

    @Column({type: 'varchar', length: 20})
    phone: string;
    
    @Column({type: 'varchar', nullable: true})
    avatar: string;

    @Column({type: 'tinyint', default: true})
    is_active: boolean;

    @Column({type: 'varchar', nullable: true})
    code_pass: string;

    @Column({type: 'datetime', nullable: true})
    date_code: Date | any;

    @OneToMany(() => Catalogue, (catalogue) => catalogue.user)
    catalogue: Catalogue[];
}