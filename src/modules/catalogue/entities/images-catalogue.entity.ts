import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Catalogue } from "./catalogue.entity";

@Entity('images_catalogue')
export class ImageCatalogue {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    catalogue_id: number;

    @ManyToOne(() => Catalogue, (catalogue) => catalogue.imageCatalogue)
    @JoinColumn({name: 'catalogue_id'})
    catalogue: Catalogue;

    @Column({type: 'varchar', length: 255})
    url: string;
}
