import { Router } from 'express';
import jetValidator from 'jet-validator';
import { ILoginReq, IReq, IRes } from '@src/routes/middleware/types';
import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { fetchRecordByQuery } from '@src/util/DbHelper';
import UserModel, { IUser } from '@src/models/User';
import { isEmpty, tick } from '@src/util/Functions';
import { RouteError } from '@src/util/Errors';
import pwdUtil from '@src/util/PwdUtil';
import { populateJwtCookie } from '@src/routes/middleware/adminMw';
import Paths from '@src/constants/Paths';

// **** Variables **** //
const validate = jetValidator();

// **** Setup auth routes **** //

const authRouter = Router();

authRouter.post(Paths.Auth.Login, validate('email', 'password'), login);
authRouter.get(Paths.Auth.Logout, logout);

// Errors
export const errors = {
  unauth: 'Unauthorized',
  emailNotFound: (email: string) => `User with email "${email}" not found`,
} as const;

// **** ROUTE HANDLERS **** //

/**
 * Login a user.
 */
async function login(req: IReq<ILoginReq>, res: IRes) {
  await authenticateUser(req, res);
  // Return
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Logout the user.
 */
function logout(_: IReq, res: IRes) {
  const { Key, Options } = EnvVars.CookieProps;
  res.clearCookie(Key, Options);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Login a user.
 */
async function authenticateUser(
  req: IReq<ILoginReq>,
  res: IRes
): Promise<string> {
  const { email, password } = req.body;

  // Fetch user
  const user = (await fetchRecordByQuery({
    collection: UserModel,
    req,
    res,
    options: {
      query: { email: email },
    },
  })) as IUser;
  if (isEmpty(user)) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      errors.emailNotFound(email)
    );
  }
  // Check password
  const hash = user.pwdHash ?? '';
  const pwdPassed = await pwdUtil.compare(password, hash);
  if (!pwdPassed) {
    // If password failed, wait 500ms this will increase security
    await tick(500);
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, errors.unauth);
  }
  // Setup Admin Cookie
  req.body.user = user;
  await populateJwtCookie(req, res);
  return Promise.resolve('Logged in');
}

export default authRouter;
