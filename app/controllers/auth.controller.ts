import { Request, Response } from "express";
import { CrudController } from "./crud.controller";
import db from "../database/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export class AuthController extends CrudController {
  public create(req: Request, res: Response): void {
    try {
      const { email, password, first_name, last_name } = req.body;
      if (!email || !password || !first_name || !last_name) res.status(500).send("Please fill all fields !!!");
      bcrypt.hash(password, 10).then((hashedPassword) => {
        const text = `INSERT INTO account (email, password, first_name, last_name)
                      VALUES ($1, $2, $3, $4)`;
        const values = [email, hashedPassword, first_name, last_name];
        db.query(text, values, (err, result) => {
          if (err) {
            res.status(500).send(err);
            return;
          }
          res.status(200).json(result.rows);
          return;
        });
      });
    } catch (err) {
      res.status(500).send(err);
      return;
    }
  }

  public read(req: Request, res: Response): void {
    throw new Error("Method not implemented.");
  }

  public update(req: Request, res: Response): void {
    try {
      const { id, first_name, last_name } = req.body;
      const text = `UPDATE account
                    SET first_name = $1,
                        last_name = $2
                    WHERE id = $3`;
      const values = [first_name, last_name, id];
      db.query(text, values, (err, result) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        res.status(200).json(result.rows);
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }

  public delete(req: Request, res: Response): void {
    throw new Error("Method not implemented.");
  }

  public signin(req: Request, res: Response): void {
    try {
      const { email, password } = req.body;
      if (!email || !password) res.status(500).send("Please fill all fields !!!");
      const text = `SELECT * FROM account
                    WHERE email = $1`;
      const values = [email];
      db.query(text, values, (err, result) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        if (!result.rows.length) {
          res.status(500).send("Email or password is wrong !!!");
          return;
        }
        bcrypt.compare(password, result.rows[0].password).then((doMatch) => {
          if (doMatch) {
            const user = result.rows[0];
            delete user.password;
            const token = jwt.sign({ user }, process.env.JWT_SECRET);
            res.status(200).json({ user, token });
          } else {
            res.status(500).send("Email or password is wrong !!!");
            return;
          }
        });
      });
    } catch (err) {
      res.status(500).send(err);
      return;
    }
  }

  public changePassword(req: Request, res: Response): void {
    try {
      const { id, newPassword } = req.body;
      bcrypt.hash(newPassword, 10).then((hashedPassword) => {
        const text = `UPDATE account
                      SET password = $1
                      WHERE id = $2`;
        const values = [hashedPassword, id];
        db.query(text, values, (err, result) => {
          if (err) {
            res.status(500).send(err);
            return;
          }
          res.status(200).json(result.rows);
        });
      });
    } catch (err) {
      res.status(500).send(err);
      return;
    }
  }
  public signout(req: Request, res: Response): void {
    res.json({ messages: "SIGN OUT" });
    return;
  }

  public signinWithThirdParty(req: Request, res: Response): void {
    try {
      const { id, email, first_name, last_name } = req.body;
      const text = `SELECT * FROM account
                    WHERE email = $1`;
      const values = [email];
      db.query(text, values, (err, result) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        if (result.rows.length === 0) {
          bcrypt.hash(id, 10).then((hashedPassword) => {
            const text = `INSERT INTO account (email, password, first_name, last_name)
                          VALUES ($1, $2, $3, $4)`;
            const values = [email, hashedPassword, first_name, last_name];
            db.query(text, values, (err, result) => {
              if (err) {
                res.status(500).send(err);
                return;
              }
              const user = {
                email,
                first_name,
                last_name,
              };
              const token = jwt.sign({ user }, process.env.JWT_SECRET);
              res.status(200).json({ user, token, messages: "create new account !!!" });
            });
          });
        } else {
          const user = result.rows[0];
          delete user.password;
          const token = jwt.sign({ user }, process.env.JWT_SECRET);
          res.status(200).json({ user, token });
        }
      });
    } catch (err) {
      res.status(500).send(err);
      return;
    }
  }
}
