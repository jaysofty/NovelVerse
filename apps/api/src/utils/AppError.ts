export class AppError extends Error {
  statusCode: number;
  code?: string;

  constructor(
    message: string,
    statusCode = 500,
    code?: string,
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;

    if (code !== undefined) {
      this.code = code;
    }

    Object.setPrototypeOf(this, AppError.prototype);
  }
}