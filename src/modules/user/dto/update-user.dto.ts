import { IsBoolean, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty({ message: "Nome é obrigatório" })
    @IsString({ message: "Nome deve ser uma string" })
    name!: string;

    @IsNotEmpty({ message: "Senha é obrigatória" })
    @MinLength(6, { message: "Senha deve ter no mínimo 6 caracteres" })
    password!: string;
}

export class UpdateVipDto {
    @IsNotEmpty({ message: "Status é obrigatório" })
    @IsBoolean({ message: "Status deve ser um booleano" })
    status!: boolean;
}
