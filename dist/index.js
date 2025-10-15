"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)({ path: path_1.default.join(__dirname, "../config/.env.dev") });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_controller_1 = __importDefault(require("./module/auth/auth.controller"));
const user_controller_1 = __importDefault(require("./module/user/user.controller"));
const error_response_1 = require("./utils/errors/error.response");
const connection_1 = require("./DB/connection");
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { status: 429, message: "Too many requests" },
});
app.use((0, cors_1.default)(), express_1.default.json(), (0, helmet_1.default)(), limiter);
(0, connection_1.connectDB)();
app.use("/api/auth", auth_controller_1.default);
app.use("/api/user", user_controller_1.default);
app.use(error_response_1.globalErrorHandler);
app.get("/", (req, res) => res.json({ status: "ok" }));
if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}
exports.default = app;
//# sourceMappingURL=index.js.map