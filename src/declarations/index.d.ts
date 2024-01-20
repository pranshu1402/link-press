import 'express';

// **** Declaration Merging **** //
declare module 'cors';

declare module 'express' {
  export interface Request {
    signedCookies: Record<string, string>;
  }
}
