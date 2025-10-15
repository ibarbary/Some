import { NextFunction, Request, Response } from "express";
interface IError extends Error {
    statusCode: number;
}
export declare class ApplicationException extends Error {
    statusCode: number;
    constructor(messsge: string, statusCode: number, options?: ErrorOptions);
}
export declare class BadRequestException extends ApplicationException {
    constructor(messsge: string, options?: ErrorOptions);
}
export declare class NotFoundException extends ApplicationException {
    constructor(messsge: string, options?: ErrorOptions);
}
export declare class UnauthorizedException extends ApplicationException {
    constructor(messsge: string, options?: ErrorOptions);
}
export declare const globalErrorHandler: (err: IError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=error.response.d.ts.map