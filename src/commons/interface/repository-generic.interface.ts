export interface IRepository<T> {
    findAll: () => Promise<T[]>;
    findById: (id: string) => Promise<T | null>;
    create: (data: Partial<T>) => Promise<T>;
    update: (id: string, data: Partial<T>) => Promise<T | null>;
    delete: (id: string) => Promise<T | null>;
}
