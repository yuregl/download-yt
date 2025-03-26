export type resolutionTag = "360" | "480" | "720" | "1080";
export type tag = "18" | "44" | "22" | "37";
export type unitFormatType = "1" | "2";

export function selectTagByResolution(resolution: resolutionTag): string {
    const tag = {
        "360": "18",
        "480": "44",
        "720": "22",
        "1080": "37",
    };
    return tag[resolution];
}

export function selectResolutionByTag(tag: tag): string {
    const resolution = {
        "18": "360",
        "44": "480",
        "22": "720",
        "37": "1080",
        "140": "only audio",
    };
    return resolution[tag];
}
