export class Constants {
  public static readonly DEFAULT_PROJECTION = {
    deleted: 0,
    __v: 0,
  };

  public static readonly DEFAULT_PUBLIC_PROJECTION = {
    deleted: 0,
    tenantId: 0,
    updatedAt: 0,
    __v: 0,
  };

  public static readonly PAGE_NO = 0;
  public static readonly PAGE_SIZE = 20;
  public static readonly SORT_BY = 'createdAt';
  public static readonly SORT_DIR = 1;
}

export class RegexPatterns {
  public static readonly ALPHANUMERIC_WITH_SPACE_IN_BETWEEN = /[^a-z0-9 ]+/;
  public static readonly SPACES = / +/;
  public static readonly HYPHEN = '-';
}

export class ApiResources {
  public static readonly BASE_ROUTE = '/';
  public static readonly AUTH_BASE_ROUTE = '/auth';
  public static readonly USER_BASE_ROUTE = '/user';
  public static readonly LINK_BASE_ROUTE = '/url';
  public static readonly REDIRECT_BASE_ROUTE = '/:id';
}
