"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function generateUsername(name, email) {
    let base = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 12);
    const suffix = (0, crypto_1.randomBytes)(2).toString("hex");
    return `${base}_${suffix}`;
}
exports.default = generateUsername;
//# sourceMappingURL=generateUsername.js.map