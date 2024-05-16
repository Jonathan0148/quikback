import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ColorCatalogue } from "./colors-catalogue.entity";
import { Size } from "src/modules/sizes/entities/size.entity";

@Entity('stock_sizes')
export class StockSize {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    color_catalogue_id: number;

    @ManyToOne(() => ColorCatalogue, (colorCatalogue) => colorCatalogue.stockSize)
    @JoinColumn({name: 'color_catalogue_id'})
    colorCatalogue: ColorCatalogue;

    @Column()
    size_id: number;

    @ManyToOne(() => Size, (size) => size.stockSize)
    @JoinColumn({name: 'size_id'})
    size: Size;

    @Column({type: 'integer'})
    stock: number;
}
