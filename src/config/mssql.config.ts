import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Catalogue } from "src/modules/catalogue/entities/catalogue.entity";
import { ColorCatalogue } from "src/modules/catalogue/entities/colors-catalogue.entity";
import { ImageCatalogue } from "src/modules/catalogue/entities/images-catalogue.entity";
import { StockSize } from "src/modules/catalogue/entities/stock-sizes.entity";
import { Color } from "src/modules/colors/entities/color.entity";
import { Size } from "src/modules/sizes/entities/size.entity";
import { Role } from "src/modules/users/entities/role.entity";
import { User } from "src/modules/users/entities/user.entity";

export const MssqlConfig = (host: string, port:string, database: string, username: string, password: string): 
TypeOrmModuleOptions =>  {
    return {
        type: 'mssql',
        host: host,
        port: parseInt(port),
        username: username,
        password: password,
        database: database,
        entities: [Role, User, Color, Size, Catalogue, ImageCatalogue, ColorCatalogue, StockSize],
        synchronize: true,
        logging: false
    }
}