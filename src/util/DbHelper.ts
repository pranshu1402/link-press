/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import StatusCodes from "@src/constants/HttpStatusCodes";
import mongoose, { FilterQuery, QueryOptions } from "mongoose";
import {
  INSERT_RECORD_ERROR_MESSAGE,
  NotFoundError,
  ServerError,
} from "@src/util/Errors";
import { Constants } from "@src/constants/Constants";
import { getISODateStr } from "@src/util/Functions";
import { Request, Response } from "express";

const { CREATED, OK } = StatusCodes;

export interface DbHelperParams {
  collection: mongoose.Model<unknown>;
  req: Request;
  res: Response;
  options?: {
    body?: unknown;
    query?: FilterQuery<unknown>;
    project?: unknown;
    responseParser?: (data: unknown, count?: number) => unknown;
    ids?: string[];
    filterOptions?: unknown;
    sortConfig?: { [sortBy: string]: number };
    callback?: (data: unknown) => Promise<unknown>;
    handleResponseManually?: boolean;
  };
}

export const getAuditInfoWithUserId = (
  body: Record<string, unknown>,
  isCreate: boolean
): Record<string, unknown> => {
  if (isCreate) {
    // body.createdBy = body.currentUser.iamUserId;
    body.createdAt = getISODateStr(new Date());
    body.deleted = false;
  }
  // body.updatedBy = body.currentUser.iamUserId;
  body.updatedAt = getISODateStr(new Date());
  return body;
};

/* *********************** INSERTIONS ************************/

export async function insertRecord({
  collection,
  req,
  res,
  options,
}: DbHelperParams) {
  const data = getAuditInfoWithUserId(options?.body || req.body, true);

  const newRecord = await new collection(data).save();

  if (newRecord._id) {
    await options?.callback?.(newRecord);
    res.status(CREATED).json({ data: newRecord });
  } else {
    throw new ServerError(INSERT_RECORD_ERROR_MESSAGE);
  }
}

/* *********************** UPDATIONS ************************/

export async function updateRecord({
  collection,
  req,
  res,
  options,
}: DbHelperParams) {
  const { query } = options || {};
  const data = getAuditInfoWithUserId(options?.body || req.body, false);

  const updatedRecord = await collection.findOneAndUpdate(
    { ...(query || {}), deleted: false } as FilterQuery<unknown>,
    {
      $set: {
        ...data,
      },
    },
    {
      returnDocument: "after",
      projection: Constants.DEFAULT_PROJECTION,
    }
  );

  if (!options.handleResponseManually)
    res.status(OK).json({ data: updatedRecord });
}

/* *********************** READS / FETCHING ************************/

export async function fetchRecordByQuery({
  collection,
  options,
}: DbHelperParams) {
  const { query, responseParser, project } = options || {};

  const configOption = {};

  if (options.sortConfig) {
    configOption["sort"] = options.sortConfig;
  }
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const data = await collection.findOne(
    { deleted: false, ...(query || {}) } as FilterQuery<unknown>,
    {
      projection: project || Constants.DEFAULT_PROJECTION,
    },
    configOption
  );

  const parsedData = responseParser ? responseParser(data) : data;
  return parsedData;
}

function getQueryOptionsWithSortAndPagination(
  queryParams: Record<string, unknown>
) {
  let pageNo = Constants.PAGE_NO,
    pageSize = Constants.PAGE_SIZE,
    sortBy = Constants.SORT_BY,
    sortDir = Constants.SORT_DIR;

  if (queryParams?.pageNo) {
    pageNo = Number(queryParams.pageNo);
  }

  if (queryParams?.pageSize) {
    pageSize = Number(queryParams.pageSize);
  }

  if (queryParams?.sortBy) {
    sortBy = queryParams.sortBy as string;
  }

  /* eslint-disable indent */
  switch (queryParams?.sortDir?.toString()) {
    case "desc":
    case "-1":
      sortDir = -1;
      break;
    case "asc":
    case "1":
    default:
      sortDir = Constants.SORT_DIR;
  }

  return {
    sort: { [sortBy]: sortDir },
    skip: pageNo * pageSize,
    limit: pageSize,
  };
}

export async function fetchRecordList({
  collection,
  req,
  res,
  options,
}: DbHelperParams) {
  const { query, project, responseParser } = options || {};

  const queryOptions: QueryOptions = getQueryOptionsWithSortAndPagination(
    req.query
  );

  const [recordList, totalCount] = await Promise.all([
    collection.find(
      { ...(query || {}), deleted: false },
      project || Constants.DEFAULT_PROJECTION,
      queryOptions
    ),
    fetchRecordCount({
      collection,
      req,
      res,
      options,
    }),
  ]);

  const data = responseParser
    ? responseParser(recordList, totalCount)
    : { totalCount, data: recordList };
  res.status(OK).json(data);
}

export async function fetchRecordCount({
  collection,
  options,
}: DbHelperParams) {
  const { query } = options || {};
  const count = await collection.countDocuments(
    { ...query, deleted: false } as FilterQuery<unknown>,
    options?.filterOptions || {}
  );

  return count;
}

/* *********************** BULK / DELETION ************************/

export async function deleteRecord({
  collection,
  req,
  res,
  options,
}: DbHelperParams) {
  const data = getAuditInfoWithUserId(options?.body || req.body, false);

  const updatedDocumentsResponse = await collection.updateMany(
    { ...(options?.query || {}), deleted: false },
    {
      $set: {
        ...data,
        deleted: true,
      },
    }
  );

  if (updatedDocumentsResponse.acknowledged) {
    res.status(OK).json({
      success: true,
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, 
      @typescript-eslint/no-unsafe-member-access */
      ids: options?.query?._id.$in,
      deletedCount: updatedDocumentsResponse.modifiedCount,
    });
  } else if (updatedDocumentsResponse.matchedCount === 0) {
    throw new NotFoundError();
  } else {
    throw new ServerError("Something went wrong, while deleting your records");
  }
}
