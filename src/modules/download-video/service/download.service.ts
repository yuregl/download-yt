import ytdl, { Payload } from "youtube-dl-exec";

import { CustomerError } from "../../../commons/Error/customer.error";
import { UserService } from "../../user/service/user.service";
import { DownloadRepository } from "../repository/download.repository";
import { CreateDownloadDto } from "../dto/download.dto";
import {
    resolutionTag,
    selectResolutionByTag,
    selectTagByResolution,
    tag,
    unitFormatType,
} from "../../../commons/utils/mapped-tag.util";

import { SendDownloadDto } from "../dto/send-download.dto";
import {
    InfoFormatDto,
    SendInfoFormatsDto,
} from "../dto/send-info-formats.dto";
import { IDownloadVideo } from "../interface/donwload.interface";

export class DownloadService {
    private readonly validFormats = ["18", "22", "37", "44", "140"];

    constructor(
        private readonly downloadRepository: DownloadRepository,
        private readonly userService: UserService,
    ) {}

    async createDownload(
        body: CreateDownloadDto,
        userId: string,
    ): Promise<SendDownloadDto> {
        const userExists = await this.userService.findById(userId);

        const metadataVideo = await ytdl(body.url, {
            dumpSingleJson: true,
        });

        if (!userExists) {
            throw new CustomerError("Usuário não encontrado", 404);
        }

        const quantityDownloadsByDay =
            await this.getAlldownloadsByUserIdByDay(userId);

        if (!userExists.vip && quantityDownloadsByDay.length >= 10) {
            throw new CustomerError(
                "Limite de downloads diários atingido",
                403,
            );
        }

        const reponseDownload = (await metadataVideo) as Payload;

        const video = reponseDownload.formats.find(
            (format) => format.format_id === body.resolution,
        );

        await this.downloadRepository.create({ url: body.url, userId });

        return {
            url: video?.url ?? "",
        };
    }

    async getAlldownloadsByUserIdByDay(
        userId: string,
    ): Promise<IDownloadVideo[]> {
        const downloads =
            await this.downloadRepository.getAlldownloadsByUserIdByDay(userId);
        return downloads;
    }

    async getValidFormats(url: string): Promise<SendInfoFormatsDto> {
        const metadataVideo = (await ytdl(url, {
            dumpSingleJson: true,
        })) as Payload;

        const getformats = metadataVideo.formats.filter((format) =>
            this.validFormats.includes(format.format_id),
        );

        const formats = getformats.map((format) => {
            return {
                fileSize: format.filesize ?? format.filesize_approx,
                extension: format.ext,
                audioChannels: format.audio_channels,
                formatId: format.format_id,
                resolution: selectResolutionByTag(
                    (format.format_id as tag) ?? "18",
                ),
            } as InfoFormatDto;
        });

        return {
            url,
            name: metadataVideo.title,
            thumbnail: metadataVideo.thumbnail,
            formats,
        };
    }
    private selectTag(formatType: string): string {
        return selectTagByResolution(formatType as resolutionTag);
    }

    private audioOrVideo(resolution: string, formatType: string): string {
        const tag = this.selectTag(resolution);
        const selectType = {
            "1": tag,
            "2": "140",
        };
        return selectType[formatType as unitFormatType];
    }
}
