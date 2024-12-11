import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: "Nome é obrigatório" })
    @IsString({ message: "Nome deve ser uma string" })
    name!: string;

    @IsNotEmpty({ message: "Email é obrigatório" })
    @IsEmail({}, { message: "Email inválido" })
    email!: string;

    @IsNotEmpty({ message: "Senha é obrigatória" })
    @MinLength(6, { message: "Senha deve ter no mínimo 6 caracteres" })
    password!: string;
}
