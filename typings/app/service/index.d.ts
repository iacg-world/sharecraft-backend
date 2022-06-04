// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportDog from '../../../app/service/Dog';
import ExportTest from '../../../app/service/Test';

declare module 'egg' {
  interface IService {
    dog: AutoInstanceType<typeof ExportDog>;
    test: AutoInstanceType<typeof ExportTest>;
  }
}
