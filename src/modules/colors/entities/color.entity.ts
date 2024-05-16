import { ColorCatalogue } from "src/modules/catalogue/entities/colors-catalogue.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('colors')
export class Color {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 100})
    name: string;

    @Column({type: 'varchar', length: 100})
    hexadecimal_code: string;

    @OneToMany(() => ColorCatalogue, (colorCatalogue) => colorCatalogue.color)
    colorCatalogue: ColorCatalogue[];
}
