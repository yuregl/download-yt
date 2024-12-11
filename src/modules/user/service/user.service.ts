import { hashPassword } from "../../../commons/utils/hashPassword";
import { IUser } from "../interface/users.interface";
import { UserRepository } from "../repository/user.repository";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { CustomerError } from "../../../commons/Error/customer.error";

export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async create(user: CreateUserDto): Promise<Partial<IUser> | null> {
        const userExists = await this.userRepository.findByEmail(user.email);
        if (userExists) {
            throw new CustomerError("Usuário já existe", 400);
        }
        user.password = await hashPassword(user.password);
        const newUser = (await this.userRepository.create(
            user,
        )) as Partial<IUser>;
        newUser.password = undefined;
        return newUser;
    }

    async findById(id: string): Promise<Partial<IUser> | null> {
        const user = (await this.userRepository.findById(id)) as Partial<IUser>;
        if (!user) {
            throw new CustomerError("Usuário não encontrado", 404);
        }
        user.password = undefined;
        return user;
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new CustomerError("Usuário não encontrado", 404);
        }
        return user;
    }

    async update(
        id: string,
        user: UpdateUserDto,
    ): Promise<Partial<IUser> | null> {
        const updatedUser = await this.userRepository.update(id, user);
        if (!updatedUser) {
            throw new CustomerError("Usuário não encontrado", 404);
        }
        user.password = await hashPassword(user.password);
        return updatedUser;
    }

    async updateVip(
        id: string,
        status: boolean,
    ): Promise<Partial<IUser> | null> {
        const user = await this.userRepository.update(id, { vip: status });
        return user;
    }

    async checkUserVip(userId: string): Promise<boolean> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new CustomerError("Usuário não encontrado", 404);
        }
        return user.vip;
    }
}
