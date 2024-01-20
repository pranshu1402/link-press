import { Router } from 'express';
import { IReq, IRes } from '@src/routes/middleware/types';
import {
  fetchRecordByQuery,
  fetchRecordList,
  insertRecord,
  updateRecord,
} from '@src/util/DbHelper';
import adminMw from '@src/routes/middleware/adminMw';
import Paths from '@src/constants/Paths';
import LinkModel, {
  ILinkData,
  ILinkReActivateReq,
  ILinkShortenReq,
} from '@src/models/Link';
import { addDaysToDate, base62encode } from '@src/util/Functions';
import logger from 'jet-logger';
import { LinkManager } from '@src/util/LinkManager';

// **** Setup user routes **** //

const linkRouter = Router();

linkRouter.use(adminMw);

// Generate shortened url
linkRouter.post(Paths.Link.Shorten, shortenUrl);

// Reactivate expired url
linkRouter.put(Paths.Link.Reactivate, reactivateUrl);

// Get all links by users
linkRouter.get(Paths.Link.GetAllByUser, getAllLinksByUser);

// **** ROUTE HANDLERS **** //
/**
 * Generate shortened url
 */
async function shortenUrl(req: IReq<ILinkShortenReq>, res: IRes) {
  const { longUrl, expirationDays = 7 } = req.body;

  /* Setup link generation index if not done already */
  if (!LinkManager.hasManagedIndex()) {
    // fetch record with maximum index and store it in linkManager
    const recordWithMaxIndex = await fetchRecordByQuery({
      collection: LinkModel,
      req,
      res,
      options: {
        query: {
          sort: { index: -1 },
          project: { index: 1 },
        },
      },
    });

    if (recordWithMaxIndex) {
      LinkManager.setIndex((recordWithMaxIndex as ILinkData).index);
    }
  }

  // generate short url from index
  const index = LinkManager.getAndIncrementIndex();
  const shortUrlId = base62encode(index);

  // create payload
  const payload: ILinkData = {
    index: index,
    longUrl,
    shortUrl: shortUrlId,
    expireBy: addDaysToDate(new Date(), expirationDays),
    clickCount: 0,
    failedViews: 0,
    deleted: false,
    createdBy: res.locals.sessionUser?.id,
  };

  insertRecord({
    collection: LinkModel,
    req,
    res,
    options: {
      body: payload,
      callback: async (linkData: ILinkData) => {
        logger.info(linkData);
      },
    },
  });
}

/**
 * Reactivate disabled url back again.
 */
async function reactivateUrl(req: IReq<ILinkReActivateReq>, res: IRes) {
  const { shortUrl, expirationDays = 7 } = req.body;

  updateRecord({
    collection: LinkModel,
    req,
    res,
    options: {
      body: {
        expireBy: addDaysToDate(new Date(), expirationDays),
        deleted: false,
      },
      query: { shortUrl: shortUrl },
    },
  });
}

async function getAllLinksByUser(req: IReq, res: IRes) {
  const { id } = req.params;

  fetchRecordList({
    collection: LinkModel,
    req,
    res,
    options: {
      query: { createdBy: id },
    },
  });
}

export default linkRouter;
