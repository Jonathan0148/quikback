import { StockSize } from "src/modules/catalogue/entities/stock-sizes.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('sizes')
export class Size {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 100})
    name: string;

    @OneToMany(() => StockSize, (stockSize) => stockSize.size)
    stockSize: StockSize[];
}
