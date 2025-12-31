// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportCustomError from '../../../app/middleware/customError';
import ExportJwt from '../../../app/middleware/jwt';
import ExportMyLogger from '../../../app/middleware/myLogger';

declare module 'egg' {
  interface IMiddleware {
    customError: typeof ExportCustomError;
    jwt: typeof ExportJwt;
    myLogger: typeof ExportMyLogger;
  }
}
