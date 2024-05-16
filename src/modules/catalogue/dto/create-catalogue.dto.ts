import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCatalogueDto {
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsArray()
    imageCatalogue: string[];

    @IsNotEmpty()
    @IsArray()
    colorCatalogue: ColorCatalogue[];
}

class ColorCatalogue {
    @IsNotEmpty()
    @IsNumber()
    catalogue_id?: number;

    @IsNotEmpty()
    @IsNumber()
    color_id: number;

    @IsNotEmpty()
    @IsArray()
    stockSize: StockSize[];
}

class StockSize {
    @IsNotEmpty()
    @IsNumber()
    color_catalogue_id?: number;

    @IsNotEmpty()
    @IsNumber()
    size_id: number;

    @IsNotEmpty()
    @IsNumber()
    stock: number;
}