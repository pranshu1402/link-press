import { Router } from 'express';
import UserModel, { IUser } from '@src/models/User';
import { IReq, IRes } from '@src/routes/middleware/types';
import { deleteRecord, insertRecord, updateRecord } from '@src/util/DbHelper';
import adminMw, {
  generatePwdHash,
  populateJwtCookie,
} from '@src/routes/middleware/adminMw';
import { ObjectId } from 'mongodb';
import Paths from '@src/constants/Paths';

// **** Setup user routes **** //

const userRouter = Router();

// Add one user
userRouter.post(Paths.Users.Register, generatePwdHash, registerUser);

// Update one user
userRouter.put(Paths.Users.Update, adminMw, update);

// Delete one user
userRouter.delete(Paths.Users.Delete, adminMw, _delete);

// **** ROUTE HANDLERS **** //
/**
 * Add one user.
 */
async function registerUser(req: IReq<{ user: IUser }>, res: IRes) {
  const { user } = req.body;

  insertRecord({
    collection: UserModel,
    req,
    res,
    options: {
      body: user,
      callback: async userData => {
        req.body.user._id = (userData as IUser)._id;
        await populateJwtCookie(req, res);
      },
    },
  });
}

/**
 * Update one user.
 */
async function update(req: IReq<{ user: IUser }>, res: IRes) {
  const { user } = req.body;

  updateRecord({
    collection: UserModel,
    req,
    res,
    options: {
      body: user,
      query: { _id: user._id },
    },
  });
}

/**
 * Delete one user.
 */
async function _delete(req: IReq, res: IRes) {
  const id = +req.params.id;

  deleteRecord({
    collection: UserModel,
    req,
    res,
    options: {
      body: {},
      query: { _id: { $in: [new ObjectId(id)] } },
    },
  });
}

export default userRouter;
