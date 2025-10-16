import { NextFunction, Request, Response } from "express";

interface IError extends Error {
  statusCode: number;
}

export class ApplicationException extends Error {
  constructor(
    messsge: string,
    public statusCode: number,
    options?: ErrorOptions
  ) {
    super(messsge, options);

    this.name = this.constructor.name;
  }
}

export class BadRequestException extends ApplicationException {
  constructor(messsge: string, options?: ErrorOptions) {
    super(messsge, 400, options);
  }
}

export class NotFoundException extends ApplicationException {
  constructor(messsge: string, options?: ErrorOptions) {
    super(messsge, 404, options);
  }
}

export class UnauthorizedException extends ApplicationException {
  constructor(messsge: string, options?: ErrorOptions) {
    super(messsge, 401, options);
  }
}

export const globalErrorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "something went wrong",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    cause: err.cause,
  });
};
