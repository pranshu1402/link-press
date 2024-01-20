import { Router } from 'express';

import authRouter from './routers/AuthRouter';
import userRouter from './routers/UserRouter';
import linkRouter from './routers/LinkRouter';
import redirectRouter from './routers/RedirectRouter';
import { ApiResources } from '@src/constants/Constants';

// **** Init **** //

const apiRouter = Router();

apiRouter.use(ApiResources.AUTH_BASE_ROUTE, authRouter);

apiRouter.use(ApiResources.USER_BASE_ROUTE, userRouter);

apiRouter.use(ApiResources.LINK_BASE_ROUTE, linkRouter);

apiRouter.use(ApiResources.REDIRECT_BASE_ROUTE, redirectRouter);

// **** Export default **** //

export default apiRouter;
