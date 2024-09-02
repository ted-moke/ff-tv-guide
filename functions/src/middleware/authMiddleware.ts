import { Request, Response, NextFunction } from "express";
import { admin } from "../firebase";
import { DecodedIdToken } from "firebase-admin/auth";
import { logger } from "firebase-functions";

// Add this interface
interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    logger.error(`No token provided ${req.headers.authorization}`);
    return res.status(401).send("Unauthorized");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error: unknown) {
    res.status(401).send(`Unauthorized: ${error}`);
  }
};
