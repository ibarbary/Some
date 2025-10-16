import { HydratedDocument, Model, ProjectionType, QueryOptions, CreateOptions, RootFilterQuery, UpdateQuery, UpdateWriteOpResult, MongooseUpdateQueryOptions, MongooseBaseQueryOptions } from "mongoose";
export declare abstract class DatabaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
    create({ data, options, }: {
        data: Partial<TDocument>[];
        options?: CreateOptions | undefined;
    }): Promise<HydratedDocument<TDocument>[] | undefined>;
    findone({ filter, options, select, }: {
        filter: RootFilterQuery<TDocument>;
        options?: QueryOptions<TDocument> | null;
        select?: ProjectionType<TDocument> | null;
    }): Promise<any | HydratedDocument<TDocument> | null>;
    find({ filter, options, select, }: {
        filter: RootFilterQuery<TDocument>;
        options?: QueryOptions<TDocument> | null;
        select?: ProjectionType<TDocument> | null;
    }): Promise<any | HydratedDocument<TDocument> | null>;
    deleteOne({ filter, options, }: {
        filter: RootFilterQuery<TDocument>;
        options?: MongooseBaseQueryOptions<TDocument> | null;
    }): Promise<any>;
    updateOne({ filter, update, options, }: {
        filter: RootFilterQuery<TDocument>;
        update: UpdateQuery<TDocument>;
        options?: MongooseUpdateQueryOptions<TDocument> | null;
    }): Promise<UpdateWriteOpResult>;
    findOneAndUpdate({ filter, update, options, }: {
        filter: RootFilterQuery<TDocument>;
        update: UpdateQuery<TDocument>;
        options?: QueryOptions<TDocument> | null;
    }): Promise<any | HydratedDocument<TDocument> | null>;
}
//# sourceMappingURL=databas.repositories.d.ts.map