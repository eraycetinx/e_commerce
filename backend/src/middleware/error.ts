import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../error";

export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    // Production: Kullanıcıya sadece anlamlı mesaj gönderilir
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Beklenmedik kritik hatalar (Database çökmesi, syntax hatası vb.)
      console.error("Kritik Hata 💥:", err);
      res.status(500).json({
        status: "error",
        message: "Bir şeyler çok ters gitti!",
      });
    }
  }
};
