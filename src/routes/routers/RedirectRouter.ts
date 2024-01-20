import { IReq, IRes } from "@src/routes/middleware/types";
import { fetchRecordByQuery, updateRecord } from "@src/util/DbHelper";
import LinkModel, { ILinkData } from "@src/models/Link";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

export async function redirectToOriginalUrl(req: IReq, res: IRes) {
  const { id } = req.params;

  let linkData;
  try {
    linkData = await fetchRecordByQuery({
      collection: LinkModel,
      req,
      res,
      options: {
        query: {
          shortUrl: id,
        },
      },
    });
  } catch (err) {
    linkData = null;
  }

  const linkNotFoundOrExpired =
    !linkData ||
    !(linkData as ILinkData).longUrl ||
    (linkData as ILinkData).expireBy < new Date();
  if (linkNotFoundOrExpired) {
    if (linkData) {
      await updateRecord({
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
          handleResponseManually: true,
        },
      });
    }

    res.redirect("/not-found");
  } else {
    await updateRecord({
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
        handleResponseManually: true,
      },
    });

    res.redirect(HttpStatusCodes.FOUND, (linkData as ILinkData).longUrl);
  }
}
