import { RepositoryBase } from "../../../commons/repository-base";
import { IDownloadVideo } from "../interface/donwload.interface";

export class DownloadRepository extends RepositoryBase<IDownloadVideo> {
    async getAlldownloadsByUserIdByDay(
        userId: string,
    ): Promise<IDownloadVideo[]> {
        const downloads = await this.model.find({
            userId,
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
        });
        return downloads;
    }
}
