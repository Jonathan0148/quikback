import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Catalogue } from "./catalogue.entity";
import { Color } from "src/modules/colors/entities/color.entity";
import { StockSize } from "./stock-sizes.entity";

@Entity('colors_catalogue')
export class ColorCatalogue {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    catalogue_id: number;

    @ManyToOne(() => Catalogue, (catalogue) => catalogue.colorCatalogue)
    @JoinColumn({name: 'catalogue_id'})
    catalogue: Catalogue;

    @Column()
    color_id: number;

    @ManyToOne(() => Color, (color) => color.colorCatalogue)
    @JoinColumn({name: 'color_id'})
    color: Color;

    @OneToMany(() => StockSize, (stockSize) => stockSize.colorCatalogue)
    stockSize: StockSize[];
}
