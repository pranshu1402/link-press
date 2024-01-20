import { Router } from "express";

import authRouter from "./routers/AuthRouter";
import userRouter from "./routers/UserRouter";
import linkRouter from "./routers/LinkRouter";
import { ApiResources } from "@src/constants/Constants";

// **** Init **** //

const apiRouter = Router();

apiRouter.use(ApiResources.AUTH_BASE_ROUTE, authRouter);

apiRouter.use(ApiResources.USER_BASE_ROUTE, userRouter);

apiRouter.use(ApiResources.LINK_BASE_ROUTE, linkRouter);

// **** Export default **** //

export default apiRouter;
