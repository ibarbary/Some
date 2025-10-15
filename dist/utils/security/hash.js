"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareText = exports.hashtext = void 0;
const bcrypt_1 = require("bcrypt");
const hashtext = async (plainText, saltround = Number(process.env.SALT)) => {
    return await (0, bcrypt_1.hash)(plainText, saltround);
};
exports.hashtext = hashtext;
const compareText = async (plainText, hashedText) => {
    return await (0, bcrypt_1.compare)(plainText, hashedText);
};
exports.compareText = compareText;
//# sourceMappingURL=hash.js.map