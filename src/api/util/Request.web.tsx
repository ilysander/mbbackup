import Config from '../../Config';
import { CodeError } from '../../resources/error';
import { Log } from '../../resources/log';
import { SignaturesItem } from '../backend/response/Execute';
import Session from '../Session';
import Crypto from 'crypto-js';
import { Validate } from '../../resources/functions';

export interface RequestParams {
  [name: string]:
    | string
    | string[]
    | null
    | number
    | boolean
    | undefined
    | RequestParams;
}
export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
export interface RequestHeaders {
  [name: string]: string;
}

export interface RequestOptions {
  headers?: RequestHeaders;
  method?: RequestMethod;
  skipRegisterActivity?: boolean;
}

export interface ResponseBody<T> {
  code: string;
  message: string;
  data: T;
}

export interface ResponseTransactionBody<T> {
  code: string;
  message: string;
  idTransaction: string;
  data: T;
}

export interface ResponseReadTransactionBody<T> {
  code: string;
  message: string;
  data: {
    transaction: T;
    usedSignatures: SignaturesItem[];
    otherSignatures: SignaturesItem[];
  };
}

export interface Response<T> {
  headers: RequestHeaders;
  body: T;
  status: number;
}

const TAG = '[Request]';
export default class Request {
  static async get<T>(
    path: string,
    params?: RequestParams,
    options: RequestOptions = {}
  ): Promise<Response<T>> {
    const { skipRegisterActivity, ...fetchOptions } = options;
    !skipRegisterActivity && (await Session.registerActivity());
    if (Validate.isDemo()) {
      return this.mockRequest<T>(RequestMethod.GET, path, params);
    }
    if (Config.settings.maintenanceMode) {
      throw new Error();
    }
    try {
      const url = this.getUrl(path);

      Log.debug(TAG, 'get', url);
      const response = await fetch(url, {
        ...fetchOptions,
        method: RequestMethod.GET,
        headers: this.getHeaders(fetchOptions.headers),
      });
      const body = await response.json();
      const status = response.status;
      const headers = response.headers;
      return {
        headers: headers as any,
        body,
        status,
      };
    } catch (e) {
      const error = new CodeError(TAG, 'get', e);
      Log.exception(TAG, 'get', error);
      throw error;
    }
  }

  static async post<T>(
    path: string,
    params?: RequestParams,
    options: RequestOptions = {}
  ): Promise<Response<T>> {
    const { skipRegisterActivity, ...fetchOptions } = options;
    !skipRegisterActivity && (await Session.registerActivity());
    if (Validate.isDemo()) {
      return this.mockRequest<T>(RequestMethod.POST, path, params);
    }
    if (Config.settings.maintenanceMode) {
      throw new Error();
    }
    try {
      const url = this.getUrl(path);
      const response = await fetch(url, {
        ...fetchOptions,
        method: RequestMethod.POST,
        body: params ? JSON.stringify(params) : undefined,
        headers: this.getHeaders(fetchOptions.headers),
      });

      const body = await response.json();
      const status = response.status;
      const headers = response.headers;
      return {
        headers: headers as any,
        body,
        status,
      };
    } catch (e) {
      const error = new CodeError(TAG, 'post', e);
      Log.exception(TAG, 'post', error);
      throw error;
    }
  }

  static async delete<T>(
    path: string,
    params?: RequestParams,
    options: RequestOptions = {}
  ): Promise<Response<T>> {
    const { skipRegisterActivity, ...fetchOptions } = options;
    !skipRegisterActivity && (await Session.registerActivity());
    if (Validate.isDemo()) {
      return this.mockRequest<T>(RequestMethod.DELETE, path, params);
    }
    if (Config.settings.maintenanceMode) {
      throw new Error();
    }
    try {
      const url = this.getUrl(path);
      Log.debug(TAG, 'delete', url);
      const response = await fetch(url, {
        ...fetchOptions,
        method: RequestMethod.DELETE,
        headers: this.getHeaders(fetchOptions.headers),
      });
      const body = await response.json();
      const status = response.status;
      const headers = response.headers;
      return {
        headers: headers as any,
        body,
        status,
      };
    } catch (e) {
      const error = new CodeError(TAG, 'delete', e);
      Log.exception(TAG, 'delete', error);
      throw error;
    }
  }

  static async put<T>(
    path: string,
    params?: RequestParams,
    options: RequestOptions = {}
  ): Promise<Response<T>> {
    const { skipRegisterActivity, ...fetchOptions } = options;
    !skipRegisterActivity && (await Session.registerActivity());
    if (Validate.isDemo()) {
      return this.mockRequest<T>(RequestMethod.PUT, path, params);
    }
    if (Config.settings.maintenanceMode) {
      throw new Error();
    }
    try {
      const url = this.getUrl(path);
      Log.debug(TAG, 'put', url);
      const response = await fetch(url, {
        ...fetchOptions,
        method: RequestMethod.PUT,
        headers: this.getHeaders(fetchOptions.headers),
      });
      const body = await response.json();
      const status = response.status;
      const headers = response.headers;
      return {
        headers: headers as any,
        body,
        status,
      };
    } catch (e) {
      const error = new CodeError(TAG, 'put', e);
      Log.exception(TAG, 'put', error);
      throw error;
    }
  }

  private static getMockData() {
    return (Config as any).mock;
  }

  private static mockRequest<T>(
    method: RequestMethod,
    path: string,
    params?: RequestParams
  ): Promise<Response<T>> {
    const uri = path.replace(Config.server.url, '');
    const mockData = this.getMockData();
    const body = params || {};

    const { dir, cachePath, cacheFallbackPath } = this.getCacheName(
      uri,
      method,
      body
    );

    Log.debug(TAG, 'mockRequest', 'getCacheName', {
      uri,
      method,
      body,
      dir,
      cachePath,
      cacheFallbackPath,
    });
    const cacheDir = dir;
    const cacheFullPath = this.getPath(cacheDir, cachePath);
    const exist = this.existFile(cacheFullPath);

    const cacheFallbackFullPath = this.getPath(cacheDir, cacheFallbackPath);
    const existFallback = this.existFile(cacheFallbackFullPath);
    let useFallback = false;
    if (cacheFallbackFullPath) {
      useFallback = !exist ? existFallback : false;
    }
    if (exist || useFallback) {
      let data: any = {};
      if (useFallback) {
        Log.debug(
          TAG,
          'mockRequest',
          'cacheFallbackFullPath',
          cacheFallbackFullPath
        );
        data = mockData[cacheFallbackFullPath];
      } else {
        Log.debug(TAG, 'mockRequest', 'cacheFullPath', cacheFullPath);
        data = mockData[cacheFullPath];
      }

      return new Promise(resolve => {
        setTimeout(() => {
          const response = data.response;
          resolve({
            body: response.body,
            headers: response.headers,
            status: response.statusCode,
          });
        }, data.duration || 0);
      });
    }

    Log.warn(TAG, 'mockRequest', 'missing', cacheFullPath);
    return new Promise(resolve => {
      resolve({
        body: ({ error: true } as any) as T,
        headers: {},
        status: 404,
      });
    });
  }

  private static getHeaders(headers?: RequestHeaders) {
    return {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': Config.server.subscriptionKey,
      ...(headers || []),
    };
  }

  private static getUrl(path: string) {
    if (path.includes('http')) {
      return path;
    }
    const url = `${Config.server.url}/${path}`;
    return url;
  }

  private static existFile(path: string) {
    try {
      const exists = this.getMockData()[path];
      return !!exists;
    } catch (e) {
      return false;
    }
  }
  private static isEmpty(object: any) {
    for (const prop in object) {
      if (object.hasOwnProperty(prop)) return false;
    }

    return JSON.stringify(object) === JSON.stringify({});
  }
  private static getCacheName(uri: string, method: RequestMethod, body: any) {
    const uriParts = uri.split('/').filter(dir => !!dir);
    const uriDirs = uriParts.slice(0, uriParts.length - 1);
    const uriPath = uriParts[uriParts.length - 1];
    const activity = body.idActivity || '';

    const dirBlocks = [...uriDirs];
    activity && uriPath && dirBlocks.push(uriPath);

    const dir = dirBlocks.join('/');
    const pathBlocks = [];

    !activity && uriPath && pathBlocks.push(uriPath);
    activity && pathBlocks.push(activity);
    method && pathBlocks.push(method.toUpperCase());
    const pathFallbackBlocks = [...pathBlocks];

    if (!this.isEmpty(body)) {
      const hash = Crypto.MD5(JSON.stringify(body)).toString();
      pathBlocks.push(hash.substring(10, 15));
    }

    const cachePath = pathBlocks.join('_') + '.cache';
    const cacheFallbackPath = pathFallbackBlocks.join('_') + '.cache';
    return { dir, cachePath, cacheFallbackPath };
  }

  private static getPath(...dirs: string[]) {
    return dirs.filter(dir => dir !== '').join('/');
  }
}
