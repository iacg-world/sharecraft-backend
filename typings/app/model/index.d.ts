// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportUser from '../../../app/model/user';
import ExportWork from '../../../app/model/work';

declare module 'egg' {
  interface IModel {
    User: ReturnType<typeof ExportUser>;
    Work: ReturnType<typeof ExportWork>;
  }
}
