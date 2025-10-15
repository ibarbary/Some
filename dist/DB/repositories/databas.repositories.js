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
        return await doc.exec();
    }
    async deleteOne({ filter, options, }) {
        return await this.model.deleteOne(filter, options || undefined);
    }
    async updateOne({ filter, update, options, }) {
        return await this.model.updateOne(filter, { ...update, $inc: { __v: 1 } }, options);
    }
    async findOneAndUpdate({ filter, update, options = { new: true }, }) {
        return await this.model.findOneAndUpdate(filter, { ...update, $inc: { __v: 1 } }, options);
    }
}
exports.DatabaseRepository = DatabaseRepository;
//# sourceMappingURL=databas.repositories.js.map