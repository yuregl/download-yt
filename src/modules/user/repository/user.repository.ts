import { RepositoryBase } from "../../../commons/repository-base";
import { IUser } from "../interface/users.interface";

export class UserRepository extends RepositoryBase<IUser> {
    async findByEmail(email: string): Promise<IUser | null> {
        const user = await this.model.findOne({ email }).exec();
        if (!user) {
            return null;
        }
        return user;
    }
}
