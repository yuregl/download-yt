/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Document, Query, Schema } from "mongoose";
import { RepositoryBase } from "../../src/commons/repository-base";

// Interface de teste
interface TestDocument extends Document {
    name: string;
    email: string;
}

describe("RepositoryBase", () => {
    let repository: RepositoryBase<TestDocument>;
    let mockModel: jest.Mocked<Model<TestDocument>>;
    let mockQuery: jest.Mocked<Query<TestDocument | null, TestDocument>>;
    let mockSchema: Schema;

    beforeEach(() => {
        mockSchema = new Schema();

        mockQuery = {
            exec: jest.fn(),
        } as unknown as jest.Mocked<Query<TestDocument | null, TestDocument>>;

        mockModel = {
            find: jest.fn().mockReturnValue(mockQuery),
            findById: jest.fn().mockReturnValue(mockQuery),
            findByIdAndDelete: jest.fn().mockReturnValue(mockQuery),
            findByIdAndUpdate: jest.fn().mockReturnValue(mockQuery),
            save: jest.fn(),
        } as unknown as jest.Mocked<Model<TestDocument>>;

        class TestRepository extends RepositoryBase<TestDocument> {
            constructor() {
                super(mockModel);
            }
        }

        repository = new TestRepository();
    });

    describe("findAll", () => {
        it("deve retornar todos os documentos", async () => {
            const mockDocuments = [
                {
                    _id: "1",
                    name: "Test 1",
                    email: "test1@test.com",
                    $assertPopulated: jest.fn(),
                    $clearModifiedPaths: jest.fn(),
                    $clone: jest.fn(),
                    $createModifiedPathsSnapshot: jest.fn(),
                    $getAllSubdocs: jest.fn(),
                    $getPopulatedDocs: jest.fn(),
                    $inc: jest.fn(),
                    $isDefault: jest.fn(),
                    $isDeleted: jest.fn(),
                    $isNew: jest.fn(),
                    $isValid: jest.fn(),
                    $locals: {},
                    $markValid: jest.fn(),
                    $model: mockModel,
                    $op: null,
                    $session: jest.fn(),
                    $set: jest.fn(),
                    $setDirty: jest.fn(),
                    $setDocs: jest.fn(),
                    $setSchema: jest.fn(),
                    $setSchemaType: jest.fn(),
                    $setShardKey: jest.fn(),
                    $setValues: jest.fn(),
                    $setters: {},
                    $where: {},
                    collection: { name: "test" },
                    db: { name: "testdb" },
                    delete: jest.fn(),
                    deleteOne: jest.fn(),
                    depopulate: jest.fn(),
                    directModifiedPaths: jest.fn(),
                    equals: jest.fn(),
                    errors: {},
                    get: jest.fn(),
                    increment: jest.fn(),
                    init: jest.fn(),
                    invalidate: jest.fn(),
                    isDirectModifiedPaths: jest.fn(),
                    isDirectSelected: jest.fn(),
                    isInit: jest.fn(),
                    isModified: jest.fn(),
                    isNew: jest.fn(),
                    isSelected: jest.fn(),
                    isSubdocument: jest.fn(),
                    markModified: jest.fn(),
                    modelName: "TestDocument",
                    overwrite: jest.fn(),
                    populate: jest.fn(),
                    populated: jest.fn(),
                    remove: jest.fn(),
                    replaceOne: jest.fn(),
                    save: jest.fn(),
                    schema: mockSchema,
                    set: jest.fn(),
                    toJSON: jest.fn(),
                    toObject: jest.fn(),
                    unmarkModified: jest.fn(),
                    update: jest.fn(),
                    updateOne: jest.fn(),
                },
                {
                    _id: "2",
                    name: "Test 2",
                    email: "test2@test.com",
                    $assertPopulated: jest.fn(),
                    $clearModifiedPaths: jest.fn(),
                    $clone: jest.fn(),
                    $createModifiedPathsSnapshot: jest.fn(),
                    $getAllSubdocs: jest.fn(),
                    $getPopulatedDocs: jest.fn(),
                    $inc: jest.fn(),
                    $isDefault: jest.fn(),
                    $isDeleted: jest.fn(),
                    $isNew: jest.fn(),
                    $isValid: jest.fn(),
                    $locals: {},
                    $markValid: jest.fn(),
                    $model: mockModel,
                    $op: null,
                    $session: jest.fn(),
                    $set: jest.fn(),
                    $setDirty: jest.fn(),
                    $setDocs: jest.fn(),
                    $setSchema: jest.fn(),
                    $setSchemaType: jest.fn(),
                    $setShardKey: jest.fn(),
                    $setValues: jest.fn(),
                    $setters: {},
                    $where: {},
                    collection: { name: "test" },
                    db: { name: "testdb" },
                    delete: jest.fn(),
                    deleteOne: jest.fn(),
                    depopulate: jest.fn(),
                    directModifiedPaths: jest.fn(),
                    equals: jest.fn(),
                    errors: {},
                    get: jest.fn(),
                    increment: jest.fn(),
                    init: jest.fn(),
                    invalidate: jest.fn(),
                    isDirectModifiedPaths: jest.fn(),
                    isDirectSelected: jest.fn(),
                    isInit: jest.fn(),
                    isModified: jest.fn(),
                    isNew: jest.fn(),
                    isSelected: jest.fn(),
                    isSubdocument: jest.fn(),
                    markModified: jest.fn(),
                    modelName: "TestDocument",
                    overwrite: jest.fn(),
                    populate: jest.fn(),
                    populated: jest.fn(),
                    remove: jest.fn(),
                    replaceOne: jest.fn(),
                    save: jest.fn(),
                    schema: mockSchema,
                    set: jest.fn(),
                    toJSON: jest.fn(),
                    toObject: jest.fn(),
                    unmarkModified: jest.fn(),
                    update: jest.fn(),
                    updateOne: jest.fn(),
                },
            ] as unknown as TestDocument[];

            (mockQuery.exec as jest.Mock).mockResolvedValue(mockDocuments);

            const result = await repository.findAll();

            expect(mockModel.find).toHaveBeenCalled();
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(result).toEqual(mockDocuments);
        });
    });

    describe("findById", () => {
        it("deve retornar um documento quando encontrado", async () => {
            const mockDocument = {
                _id: "1",
                name: "Test",
                email: "test@test.com",
                $assertPopulated: jest.fn(),
                $clearModifiedPaths: jest.fn(),
                $clone: jest.fn(),
                $createModifiedPathsSnapshot: jest.fn(),
                $getAllSubdocs: jest.fn(),
                $getPopulatedDocs: jest.fn(),
                $inc: jest.fn(),
                $isDefault: jest.fn(),
                $isDeleted: jest.fn(),
                $isNew: jest.fn(),
                $isValid: jest.fn(),
                $locals: {},
                $markValid: jest.fn(),
                $model: mockModel,
                $op: null,
                $session: jest.fn(),
                $set: jest.fn(),
                $setDirty: jest.fn(),
                $setDocs: jest.fn(),
                $setSchema: jest.fn(),
                $setSchemaType: jest.fn(),
                $setShardKey: jest.fn(),
                $setValues: jest.fn(),
                $setters: {},
                $where: {},
                collection: {} as any,
                db: {} as any,
                delete: jest.fn(),
                deleteOne: jest.fn(),
                depopulate: jest.fn(),
                directModifiedPaths: jest.fn(),
                equals: jest.fn(),
                errors: {},
                get: jest.fn(),
                increment: jest.fn(),
                init: jest.fn(),
                invalidate: jest.fn(),
                isDirectModifiedPaths: jest.fn(),
                isDirectSelected: jest.fn(),
                isInit: jest.fn(),
                isModified: jest.fn(),
                isNew: jest.fn(),
                isSelected: jest.fn(),
                isSubdocument: jest.fn(),
                markModified: jest.fn(),
                modelName: "TestDocument",
                overwrite: jest.fn(),
                populate: jest.fn(),
                populated: jest.fn(),
                remove: jest.fn(),
                replaceOne: jest.fn(),
                save: jest.fn(),
                schema: {} as any,
                set: jest.fn(),
                toJSON: jest.fn(),
                toObject: jest.fn(),
                unmarkModified: jest.fn(),
                update: jest.fn(),
                updateOne: jest.fn(),
            } as unknown as TestDocument;

            mockQuery.exec.mockResolvedValue(mockDocument);

            const result = await repository.findById("1");

            expect(mockModel.findById).toHaveBeenCalledWith("1");
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(result).toEqual(mockDocument);
        });

        it("deve retornar null quando o documento não for encontrado", async () => {
            mockQuery.exec.mockResolvedValue(null);

            const result = await repository.findById("1");

            expect(mockModel.findById).toHaveBeenCalledWith("1");
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe("delete", () => {
        it("deve deletar um documento quando encontrado", async () => {
            const mockDocument = {
                _id: "1",
                name: "Test",
                email: "test@test.com",
                $assertPopulated: jest.fn(),
                $clearModifiedPaths: jest.fn(),
                $clone: jest.fn(),
                $createModifiedPathsSnapshot: jest.fn(),
                $getAllSubdocs: jest.fn(),
                $getPopulatedDocs: jest.fn(),
                $inc: jest.fn(),
                $isDefault: jest.fn(),
                $isDeleted: jest.fn(),
                $isNew: jest.fn(),
                $isValid: jest.fn(),
                $locals: {},
                $markValid: jest.fn(),
                $model: mockModel,
                $op: null,
                $session: jest.fn(),
                $set: jest.fn(),
                $setDirty: jest.fn(),
                $setDocs: jest.fn(),
                $setSchema: jest.fn(),
                $setSchemaType: jest.fn(),
                $setShardKey: jest.fn(),
                $setValues: jest.fn(),
                $setters: {},
                $where: {},
                collection: {} as any,
                db: {} as any,
                delete: jest.fn(),
                deleteOne: jest.fn(),
                depopulate: jest.fn(),
                directModifiedPaths: jest.fn(),
                equals: jest.fn(),
                errors: {},
                get: jest.fn(),
                increment: jest.fn(),
                init: jest.fn(),
                invalidate: jest.fn(),
                isDirectModifiedPaths: jest.fn(),
                isDirectSelected: jest.fn(),
                isInit: jest.fn(),
                isModified: jest.fn(),
                isNew: jest.fn(),
                isSelected: jest.fn(),
                isSubdocument: jest.fn(),
                markModified: jest.fn(),
                modelName: "TestDocument",
                overwrite: jest.fn(),
                populate: jest.fn(),
                populated: jest.fn(),
                remove: jest.fn(),
                replaceOne: jest.fn(),
                save: jest.fn(),
                schema: {} as any,
                set: jest.fn(),
                toJSON: jest.fn(),
                toObject: jest.fn(),
                unmarkModified: jest.fn(),
                update: jest.fn(),
                updateOne: jest.fn(),
            } as unknown as TestDocument;

            mockQuery.exec.mockResolvedValue(mockDocument);

            const result = await repository.delete("1");

            expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith("1");
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(result).toEqual(mockDocument);
        });

        it("deve retornar null quando o documento não for encontrado", async () => {
            mockQuery.exec.mockResolvedValue(null);

            const result = await repository.delete("1");

            expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith("1");
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe("update", () => {
        it("deve atualizar um documento quando encontrado", async () => {
            const mockDocument = {
                _id: "1",
                name: "Updated Test",
                email: "test@test.com",
                $assertPopulated: jest.fn(),
                $clearModifiedPaths: jest.fn(),
                $clone: jest.fn(),
                $createModifiedPathsSnapshot: jest.fn(),
                $getAllSubdocs: jest.fn(),
                $getPopulatedDocs: jest.fn(),
                $inc: jest.fn(),
                $isDefault: jest.fn(),
                $isDeleted: jest.fn(),
                $isNew: jest.fn(),
                $isValid: jest.fn(),
                $locals: {},
                $markValid: jest.fn(),
                $model: mockModel,
                $op: null,
                $session: jest.fn(),
                $set: jest.fn(),
                $setDirty: jest.fn(),
                $setDocs: jest.fn(),
                $setSchema: jest.fn(),
                $setSchemaType: jest.fn(),
                $setShardKey: jest.fn(),
                $setValues: jest.fn(),
                $setters: {},
                $where: {},
                collection: {} as any,
                db: {} as any,
                delete: jest.fn(),
                deleteOne: jest.fn(),
                depopulate: jest.fn(),
                directModifiedPaths: jest.fn(),
                equals: jest.fn(),
                errors: {},
                get: jest.fn(),
                increment: jest.fn(),
                init: jest.fn(),
                invalidate: jest.fn(),
                isDirectModifiedPaths: jest.fn(),
                isDirectSelected: jest.fn(),
                isInit: jest.fn(),
                isModified: jest.fn(),
                isNew: jest.fn(),
                isSelected: jest.fn(),
                isSubdocument: jest.fn(),
                markModified: jest.fn(),
                modelName: "TestDocument",
                overwrite: jest.fn(),
                populate: jest.fn(),
                populated: jest.fn(),
                remove: jest.fn(),
                replaceOne: jest.fn(),
                save: jest.fn(),
                schema: {} as any,
                set: jest.fn(),
                toJSON: jest.fn(),
                toObject: jest.fn(),
                unmarkModified: jest.fn(),
                update: jest.fn(),
                updateOne: jest.fn(),
            } as unknown as TestDocument;

            mockQuery.exec.mockResolvedValue(mockDocument);

            const result = await repository.update("1", {
                name: "Updated Test",
            });

            expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "1",
                { $set: { name: "Updated Test" } },
                { new: true },
            );
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(result).toEqual(mockDocument);
        });

        it("deve retornar null quando o documento não for encontrado", async () => {
            mockQuery.exec.mockResolvedValue(null);

            const result = await repository.update("1", {
                name: "Updated Test",
            });

            expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "1",
                { $set: { name: "Updated Test" } },
                { new: true },
            );
            expect(mockQuery.exec).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });
});
