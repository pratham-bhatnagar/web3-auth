import Express, { Response, Request, NextFunction } from "express";
import { config } from "dotenv";
config();

const app = Express();
app.use(Express.json());
app.set("trust proxy", true);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
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
