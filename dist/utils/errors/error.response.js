"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.UnauthorizedException = exports.NotFoundException = exports.BadRequestException = exports.ApplicationException = void 0;
class ApplicationException extends Error {
    statusCode;
    constructor(messsge, statusCode, options) {
        super(messsge, options);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.ApplicationException = ApplicationException;
class BadRequestException extends ApplicationException {
    constructor(messsge, options) {
        super(messsge, 400, options);
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends ApplicationException {
    constructor(messsge, options) {
        super(messsge, 404, options);
    }
}
exports.NotFoundException = NotFoundException;
class UnauthorizedException extends ApplicationException {
    constructor(messsge, options) {
        super(messsge, 401, options);
    }
}
exports.UnauthorizedException = UnauthorizedException;
const globalErrorHandler = (err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "something went wrong",
        stack: process.env.NODE_ENV === "DEV" ? err.stack : undefined,
        cause: err.cause,
    });
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=error.response.js.map