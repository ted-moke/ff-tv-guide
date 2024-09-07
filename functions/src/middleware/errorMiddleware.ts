import { Request, Response, NextFunction } from "express";
import * as functions from "firebase-functions";

const logger = functions.logger;

export const errorHandler = (err: Error, req: Request, res: Response) => {
  logger.error("Error in errorHandler:", err);
  res.status(500).send({ error: "Something went wrong!" });
};
