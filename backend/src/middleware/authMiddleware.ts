import { Request, Response, NextFunction } from "express";
import { getAdmin } from "../firebase"; // Use the shared instance
import { DecodedIdToken } from "firebase-admin/auth";

// Add this interface
interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const admin = await getAdmin();
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (_error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
