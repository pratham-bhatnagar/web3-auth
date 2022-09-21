import { Response, Request, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export const getSignedMessage = (address: string, nonce: number) => {
  return `Sign this message for Address ${address}\n\nNoce :${nonce}`;
};

export interface JwtPayload {
  nonce: number;
  address: string;
}

// @TODO - Add Middleware for JWT verification

// function authenticateToken(req:Request, res:Response, next:NextFunction) {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]

//     if (token == null) return res.sendStatus(401)

//     verify(token, process.env.JWT_SECRET!, (err, authData) => {
//       console.log(err)

//       if (err) return res.sendStatus(403)

//       req.authData = authData

//       next()
//     })
//   }

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null)
    return res.status(401).json({ success: false, message: "Token Required" });
};
