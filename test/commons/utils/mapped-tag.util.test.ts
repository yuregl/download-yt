import {
    selectResolutionByTag,
    selectTagByResolution,
} from "../../../src/commons/utils/mapped-tag.util";

describe("selectTagByResolution", () => {
    it("should return the correct tag for a given resolution", () => {
        expect(selectTagByResolution("360")).toBe("18");
        expect(selectTagByResolution("480")).toBe("44");
        expect(selectTagByResolution("720")).toBe("22");
        expect(selectTagByResolution("1080")).toBe("37");
    });
});

describe("selectResolutionByTag", () => {
    it("should return the correct resolution for a given tag", () => {
        expect(selectResolutionByTag("18")).toBe("360");
        expect(selectResolutionByTag("44")).toBe("480");
        expect(selectResolutionByTag("22")).toBe("720");
        expect(selectResolutionByTag("37")).toBe("1080");
    });
});
