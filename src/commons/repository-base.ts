import { Model, Document } from "mongoose";
import { IRepository } from "./interface/repository-generic.interface";

export abstract class RepositoryBase<T extends Document>
    implements IRepository<T>
{
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async findAll(): Promise<T[]> {
        return this.model.find().exec();
    }

    async findById(id: string): Promise<T | null> {
        const item = await this.model.findById(id).exec();
        if (!item) {
            return null;
        }
        return item;
    }

    async create(data: Partial<T>): Promise<T> {
        const item = new this.model(data);
        return item.save();
    }

    async delete(id: string): Promise<T | null> {
        const item = await this.model.findByIdAndDelete(id).exec();
        if (!item) {
            return null;
        }
        return item;
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        const item = await this.model
            .findByIdAndUpdate(id, { $set: data }, { new: true })
            .exec();

        if (!item) {
            return null;
        }
        return item;
    }
}
