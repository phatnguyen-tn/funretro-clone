import { Express, Request, Response, Router } from "express";
import express from "express";
import path from "path";
import { authRoute, boardRoute } from "./routers/index.route";

export class Server {
  private app: Express;

  constructor(app: Express) {
    this.app = app;

    this.app.use(express.static(path.resolve("./") + "/build/frontend"));

    this.app.get("/api", (req: Request, res: Response): void => {
      res.send("You have reached the API!");
    });

    this.app.use("/api/auth", authRoute);

    this.app.use("/api/board", boardRoute);

    this.app.get("*", (req: Request, res: Response): void => {
      res.sendFile(path.resolve("./") + "/build/frontend/index.html");
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => console.log(`Server listening on: http://localhost:${port}`));
  }
}
