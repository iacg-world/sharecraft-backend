// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import 'egg-onerror';
import 'egg-session';
import 'egg-i18n';
import 'egg-watcher';
import 'egg-multipart';
import 'egg-security';
import 'egg-development';
import 'egg-logrotator';
import 'egg-schedule';
import 'egg-static';
import 'egg-jsonp';
import 'egg-view';
import 'egg-view-nunjucks';
import 'egg-mongoose';
import 'egg-validate';
import 'egg-bcrypt';
import 'egg-jwt';
import 'egg-redis';
import 'egg-cors';
import 'egg-oss';
import { EggPluginItem } from 'egg';
declare module 'egg' {
  interface EggPlugin {
    onerror?: EggPluginItem;
    session?: EggPluginItem;
    i18n?: EggPluginItem;
    watcher?: EggPluginItem;
    multipart?: EggPluginItem;
    security?: EggPluginItem;
    development?: EggPluginItem;
    logrotator?: EggPluginItem;
    schedule?: EggPluginItem;
    static?: EggPluginItem;
    jsonp?: EggPluginItem;
    view?: EggPluginItem;
    nunjucks?: EggPluginItem;
    mongoose?: EggPluginItem;
    validate?: EggPluginItem;
    bcrypt?: EggPluginItem;
    jwt?: EggPluginItem;
    redis?: EggPluginItem;
    cors?: EggPluginItem;
    oss?: EggPluginItem;
  }
}