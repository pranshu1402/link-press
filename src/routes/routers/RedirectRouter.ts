import { Router } from 'express';
import { IReq, IRes } from '@src/routes/middleware/types';
import { fetchRecordByQuery, updateRecord } from '@src/util/DbHelper';
import LinkModel, { ILinkData } from '@src/models/Link';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

const redirectRouter = Router();

redirectRouter.get('', redirectToOriginalUrl);

async function redirectToOriginalUrl(req: IReq, res: IRes) {
  const { id } = req.params;

  const linkData = await fetchRecordByQuery({
    collection: LinkModel,
    req,
    res,
    options: {
      query: {
        shortUrl: id,
      },
    },
  });

  const linkNotFoundOrExpired =
    !linkData ||
    !(linkData as ILinkData).longUrl ||
    (linkData as ILinkData).expireBy < new Date();
  if (linkNotFoundOrExpired) {
    if (linkData) {
      updateRecord({
        collection: LinkModel,
        req,
        res,
        options: {
          body: {
            failedViews: (linkData as ILinkData).failedViews + 1,
          },
          query: {
            shortUrl: id,
          },
        },
      });
    }

    res.redirect(HttpStatusCodes.NOT_FOUND, '/not-found');
  } else {
    updateRecord({
      collection: LinkModel,
      req,
      res,
      options: {
        body: {
          clickCount: (linkData as ILinkData).clickCount + 1,
        },
        query: {
          shortUrl: id,
        },
      },
    });
    res.redirect(HttpStatusCodes.FOUND, (linkData as ILinkData).longUrl);
  }
}

export default redirectRouter;
