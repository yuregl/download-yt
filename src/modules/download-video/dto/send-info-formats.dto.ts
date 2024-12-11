export class InfoFormatDto {
    fileSize!: number;
    extension!: string;
    audioChannels!: number;
    formatId!: string;
    resolution!: string;
}

export class SendInfoFormatsDto {
    name!: string;
    thumbnail!: string;
    formats!: InfoFormatDto[];
    url!: string;
}
