import { IsNotEmpty, IsString } from "class-validator";

export class GetFormatsDto {
    @IsNotEmpty({ message: "URL é obrigatório" })
    @IsString({ message: "URL deve ser uma string" })
    url!: string;
}
