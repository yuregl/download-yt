import { handleError } from "../../../src/commons/utils/type-error.utils";
import { Response } from "express";
import { CustomerError } from "../../../src/commons/Error/customer.error"; // Supondo que você tenha uma classe CustomerError

describe("handleError function", () => {
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn().mockReturnValue({} as Response);
        mockStatus = jest.fn().mockReturnValue({
            json: mockJson,
        } as unknown as Response);

        mockResponse = {
            status: mockStatus,
            json: mockJson,
        };
    });

    it("should handle CustomerError correctly", () => {
        const customerError = new CustomerError("Test customer error", 400);

        handleError(customerError, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            message: "Test customer error",
        });
    });

    it("should handle generic Error with 500 status", () => {
        const genericError = new Error("Generic error message");

        handleError(genericError, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            message: "Generic error message",
        });
    });
});
