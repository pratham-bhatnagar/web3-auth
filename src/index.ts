import Express, { Response, Request, NextFunction } from "express";
import { config } from "dotenv";

import { getSignedMessage, JwtPayload } from "./helper";
import * as jwt from "jsonwebtoken";
import Web3 from "web3";
config();

const app = Express();
const web3 = new Web3("https://cloudflare-eth.com/");
app.use(Express.json());
app.use(Express.static("client"));
app.set("trust proxy", true);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/temp-token", (req: Request, res: Response, next: NextFunction) => {
  const nonce = new Date().getTime();
  const address = req.query.address;
  const tempToken = jwt.sign({ nonce, address }, process.env.JWT_SECRET!, {
    expiresIn: 1000,
  });
  const message = getSignedMessage(address as string, nonce);
  res.json({
    status: true,
    tempToken: tempToken,
    message: message,
  });
});

app.post("/verify", async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const signature = req.query.signature as string;
  const tempToken = authHeader && authHeader.split(" ")[1];
  if (tempToken === null)
    return res
      .sendStatus(403)
      .json({ status: false, message: "Not a Valid Temp Token" });

  const userData = jwt.verify(
    tempToken as string,
    process.env.JWT_SECRET!
  ) as JwtPayload;
  const _address = userData.address;
  const _nonce = userData.nonce;
  const message = getSignedMessage(_address, _nonce);
  const address = await web3.eth.accounts.recover(message, signature);
  if (address.toLowerCase() === _address.toLowerCase()) {
    const accessToken = jwt.sign({ address }, process.env.JWT_SECRET!, {
      expiresIn: "10d",
    });
    res.json({ success: true, accessToken: accessToken });
  } else {
    res.sendStatus(403).json({ status: false, message: "Unauthorised User" });
  }
});

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(405).json({
    success: false,
    message: "Method Not Allowed!",
  });
});

app.listen(process.env.PORT, () => {
  console.log(
    `:::SERVER RUNNING ON PORT ${process.env.PORT} ::: http://localhost:${process.env.PORT}`
  );
});

process.on("SIGHUP", (_) => {
  process.exit(0);
});
process.on("SIGINT", (_) => {
  process.exit(0);
});
