import { Format } from "youtube-dl-exec";

export interface SelectedFormats {
    videoFormat: Format | undefined;
    audioFormat: Format | undefined;
}
