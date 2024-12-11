import { RepositoryBase } from "../../commons/repository-base";
import { IUser } from "./interface/users.interface";
import { UserModel } from "./schema/user.schema";

export class UserRepository extends RepositoryBase<IUser> {
    constructor() {
        super(UserModel);
    }
}
