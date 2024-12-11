import { IsNotEmpty, IsString } from "class-validator";

export class CreateDownloadDto {
    @IsNotEmpty({ message: "URL é obrigatório" })
    @IsString({ message: "URL deve ser uma string" })
    url!: string;

    @IsNotEmpty({ message: "Resolução é obrigatória" })
    @IsString({ message: "Resolução deve ser uma string" })
    resolution!: string;
}
