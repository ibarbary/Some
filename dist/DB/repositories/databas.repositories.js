"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
class DatabaseRepository {
    model;
    // constractuor
    constructor(model) {
        this.model = model;
    }
    // methods
    async create({ data, options, }) {
        return await this.model.create(data, options);
    }
    // methods
    async findone({ filter, options, select, }) {
        const doc = this.model.findOne(filter).select(select || "");
        if (options?.populate) {
            doc.populate(options.populate);
        }
        if (options?.lean) {
            doc.lean(options.lean);
        }
        return await doc.exec();
    }
    async find({ filter, options, select, }) {
        const doc = this.model.find(filter).select(select || "");
        if (options?.populate) {
            doc.populate(options.populate);
        }
        if (options?.lean) {
            doc.lean(options.lean);
        }
        if (options?.sort) {
            doc.sort(options.sort);
        }
        if (options?.limit) {
            doc.limit(options.limit);
        }
        return await doc.exec();
    }
    async deleteOne({ filter, options, }) {
        return await this.model.deleteOne(filter, options || undefined);
    }
    async updateOne({ filter, update, options, }) {
        const { $inc: existingInc, ...rest } = update;
        const mergedInc = { __v: 1, ...(existingInc || {}) };
        return await this.model.updateOne(filter, { ...rest, $inc: mergedInc }, options);
    }
    async findOneAndUpdate({ filter, update, options = { new: true }, }) {
        const { $inc: existingInc, ...rest } = update;
        const mergedInc = { __v: 1, ...(existingInc || {}) };
        return await this.model.findOneAndUpdate(filter, { ...rest, $inc: mergedInc }, options);
    }
    async countDocuments({ filter, options, }) {
        return await this.model.countDocuments(filter || {}, options || undefined);
    }
}
exports.DatabaseRepository = DatabaseRepository;
//# sourceMappingURL=databas.repositories.js.map