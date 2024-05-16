import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ImageCatalogue } from "./images-catalogue.entity";
import { ColorCatalogue } from "./colors-catalogue.entity";

@Entity('catalogues')
export class Catalogue {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @ManyToOne(() => User, (user) => user.catalogue)
    @JoinColumn({name: 'user_id'})
    user: User;

    @Column({type: 'varchar', length: 100})
    name: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    description: string;

    @Column({type: 'float'})
    price: number;

    @OneToMany(() => ImageCatalogue, (imageCatalogue) => imageCatalogue.catalogue)
    imageCatalogue: ImageCatalogue[];

    @OneToMany(() => ColorCatalogue, (colorCatalogue) => colorCatalogue.catalogue)
    colorCatalogue: ColorCatalogue[];
}
