// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExtendIHelper from '../../../app/extend/helper';
type ExtendIHelperType = typeof ExtendIHelper;
declare module 'egg' {
  interface IHelper extends ExtendIHelperType { }
}