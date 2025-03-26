import { CustomerError } from "../../../src/commons/Error/customer.error";

describe("CustomerError", () => {
    it("should create an instance of CustomerError with the correct message and code", () => {
        const errorMessage = "Customer not found";
        const errorCode = 404;

        const error = new CustomerError(errorMessage, errorCode);

        expect(error).toBeInstanceOf(CustomerError);
        expect(error.message).toBe(errorMessage);
        expect(error.statusCode).toBe(errorCode);
        expect(error.stack).toBeDefined();
    });

    it("should have a stack trace", () => {
        const error = new CustomerError("Some error", 404);
        expect(error.stack).toBeDefined();
    });
});
