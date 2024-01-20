export class Constants {
  static readonly DEFAULT_PROJECTION = {
    deleted: 0,
    __v: 0
  };

  static readonly DEFAULT_PUBLIC_PROJECTION = {
    deleted: 0,
    tenantId: 0,
    updatedAt: 0,
    __v: 0
  };

  static readonly PAGE_NO = 0;
  static readonly PAGE_SIZE = 20;
  static readonly SORT_BY = "createdAt";
  static readonly SORT_DIR = 1;
}

export class RegexPatterns {
  static readonly ALPHANUMERIC_WITH_SPACE_IN_BETWEEN = /[^a-z0-9 ]+/;
  static readonly SPACES = / +/;
  static readonly HYPHEN = "-";
}

export class ApiResources {
  static readonly BASE_ROUTE = "/api";
  static readonly AUTH_BASE_ROUTE = "/auth";
  static readonly USER_BASE_ROUTE = "/user";
  static readonly FILE_BASE_ROUTE = "/file";
}
