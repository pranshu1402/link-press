import { Router } from "express";
import { IReq, IRes } from "@src/routes/middleware/types";
import {
  fetchRecordByQuery,
  fetchRecordCount,
  fetchRecordList,
  insertRecord,
  updateRecord,
} from "@src/util/DbHelper";
import adminMw from "@src/routes/middleware/adminMw";
import Paths from "@src/constants/Paths";
import LinkModel, {
  ILinkData,
  ILinkReActivateReq,
  ILinkShortenReq,
} from "@src/models/Link";
import { addDaysToDate, base62encode } from "@src/util/Functions";
import logger from "jet-logger";
import { LinkManager } from "@src/util/LinkManager";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { NotFoundError } from "@src/util/Errors";

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
        sortConfig: { indexId: -1 },
      },
    });

    if (recordWithMaxIndex) {
      LinkManager.setIndex((recordWithMaxIndex as ILinkData).indexId + 1);
    } else {
      const recordCount = await fetchRecordCount({
        collection: LinkModel,
        req,
        res,
        options: {},
      });

      if (recordCount === 0) {
        LinkManager.setIndex(1);
      } else {
        throw new NotFoundError("No record found in db for short links.");
      }
    }
  }

  const existingRecordWithLongUrl = await fetchRecordByQuery({
    collection: LinkModel,
    req,
    res,
    options: {
      query: {
        longUrl: longUrl,
        createdBy: res.locals.sessionUser?._id,
      },
    },
  });

  if (existingRecordWithLongUrl) {
    res.status(HttpStatusCodes.FOUND).json({ data: existingRecordWithLongUrl });
    return;
  }

  // generate short url from index
  const index = LinkManager.getAndIncrementIndex();
  let shortUrlId = base62encode(index);
  const shortUrlIDString = String(shortUrlId || "");
  if (shortUrlIDString.length < 5) {
    const difference = 5 - shortUrlIDString.length;
    const randomString = "abcde";
    shortUrlId = `${randomString.slice(0, difference)}` + shortUrlId;
  }

  // create payload
  const payload: ILinkData = {
    indexId: index,
    longUrl,
    shortUrl: shortUrlId,
    expireBy: addDaysToDate(new Date(), expirationDays),
    clickCount: 0,
    failedViews: 0,
    deleted: false,
    createdBy: res.locals.sessionUser?._id,
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
  const userId = res.locals.sessionUser?._id;
  logger.info(userId);
  fetchRecordList({
    collection: LinkModel,
    req,
    res,
    options: {
      query: { createdBy: userId },
    },
  });
}

export default linkRouter;
