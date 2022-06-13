import { Application } from 'egg'
import axios, { AxiosInstance } from 'axios'
import Dysmsapi from '@alicloud/dysmsapi20170525'
import * as $OpenApi from '@alicloud/openapi-client'
const AXIOS = Symbol('Application#axios')
const ALCLIENT = Symbol('Application#ALClient')
export default {
  // 方法扩展
  echo(msg: string) {
    const that = this as Application
    return `hello${msg}${that.config.name}`
  },

  // 属性扩展
  get axiosInstance(): AxiosInstance {
    if (!this[AXIOS]) {
      this[AXIOS] = axios.create({
        baseURL: 'https://dog.ceo/',
        timeout: 5000,
      })
    }
    return this[AXIOS]
  },
  get ALClient(): Dysmsapi {
    const that = this as Application
    const { accessKeyId, accessKeySecret, endpoint } =
      that.config.aliCloudConfig
    if (!this[ALCLIENT]) {
      const config = new $OpenApi.Config({
        accessKeyId,
        accessKeySecret,
      })
      config.endpoint = endpoint
      this[ALCLIENT] = new Dysmsapi(config)
    }
    return this[ALCLIENT]
  },
}
