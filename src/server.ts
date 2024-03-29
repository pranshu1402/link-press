/* eslint-disable comma-dangle */
/**
 * Setup express server.
 */

import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import logger from "jet-logger";

import "express-async-errors";

import BaseRouter from "@src/routes";
import Paths from "@src/constants/Paths";

import EnvVars from "@src/constants/EnvVars";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import { NodeEnvs } from "@src/constants/Enums";
import { RouteError } from "@src/util/Errors";
import { redirectToOriginalUrl } from "./routes/routers/RedirectRouter";

// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));

app.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  }
);

// ** Front-End Content ** //

// Set views directory (html)
const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Redirect to login if not logged in.
app.get("/not-found", (req: Request, res: Response) => {
  res.sendFile("pageNotFound.html", { root: viewsDir });
});

// Redirect to login if not logged in.
app.get("/users", (req: Request, res: Response) => {
  const jwt = req.signedCookies[EnvVars.CookieProps.Key];
  if (!jwt) {
    res.redirect("/");
  } else {
    res.sendFile("users.html", { root: viewsDir });
  }
});

// Redirect to login if not logged in.
app.get("/generate", (req: Request, res: Response) => {
  const jwt = req.signedCookies[EnvVars.CookieProps.Key];
  if (!jwt) {
    res.redirect("/");
  } else {
    res.sendFile("generator.html", { root: viewsDir });
  }
});

// Redirect to login if not logged in.
app.get("/my-links", (req: Request, res: Response) => {
  const jwt = req.signedCookies[EnvVars.CookieProps.Key];
  if (!jwt) {
    res.redirect("/");
  } else {
    res.sendFile("links.html", { root: viewsDir });
  }
});

app.use(Paths.Link.Redirect, redirectToOriginalUrl);

// Nav to login pg by default
app.get("/", (req: Request, res: Response) => {
  const jwt = req.signedCookies[EnvVars.CookieProps.Key];
  if (!jwt) {
    res.sendFile("login.html", { root: viewsDir });
  } else {
    res.redirect("/generate");
  }
});

// **** Export default **** //

export default app;
