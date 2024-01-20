/**
 * Middleware to verify user logged in and is an an admin.
 */

import { Request, Response, NextFunction } from "express";

import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import { ISessionUser, IUser } from "@src/models/User";
import EnvVars from "@src/constants/EnvVars";
import jwtUtil from "@src/util/JwtUtil";
import { IReq } from "./types";
import { IRes } from "./types";
import PwdUtil from "@src/util/PwdUtil";

// **** Variables **** //

const jwtNotPresentErr = "JWT not present in signed cookie.",
  userUnauthErr = "User not authorized to perform this action";

// **** Functions **** //

/**
 * See note at beginning of file.
 */
async function adminMw(req: Request, res: Response, next: NextFunction) {
  // Extract the token
  const cookieName = EnvVars.CookieProps.Key,
    jwt = req.signedCookies[cookieName];
  if (!jwt) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: jwtNotPresentErr });
  }

  // Make sure user role is an admin
  const clientData = await jwtUtil.decode<ISessionUser>(jwt);

  if (typeof clientData === "object") {
    res.locals.sessionUser = clientData;
    return next();
    // Return an unauth error if user is not an admin
  } else {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: userUnauthErr });
  }
}

export function getSignedJwtCookieFromUser(user: IUser) {
  return jwtUtil.sign({
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export async function populateJwtCookie(
  req: IReq<{ user?: IUser }>,
  res: IRes
) {
  const { user } = req.body;
  const signedJwt = await getSignedJwtCookieFromUser(user);

  const { Key, Options } = EnvVars.CookieProps;
  res.cookie(Key, signedJwt, Options);
}

/**
 * See note at beginning of file.
 */
export async function generatePwdHash(
  req: IReq<{ user: { password?: string; email: string; pwdHash?: string } }>,
  res: IRes,
  next: NextFunction
) {
  const { user } = req.body;
  if (user?.password) {
    const { password, ...newUserData } = user;

    const passwordHash = await PwdUtil.getHash(password);
    newUserData.pwdHash = passwordHash;
    req.body.user = newUserData;
    return next();
    // Return an unauth error if user is not an admin
  } else {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: userUnauthErr });
  }
}

// **** Export Default **** //

export default adminMw;
