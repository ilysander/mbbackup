import pinch from 'react-native-pinch';
import Config from '../../Config';
import DeviceInfo from 'react-native-device-info';
import CodeError from '../../resources/error/CodeError';
import Log from '../../resources/log/Log';
import { SignaturesItem } from '../backend/response/Execute';
import Session from '../Session';
import Crypto from 'crypto-js';
import Validate from '../../resources/functions/Validate';
import perf from '@react-native-firebase/perf';
import functions from '@react-native-firebase/functions';
import RSA, { Hash, SaltLength } from 'react-native-fast-rsa';
import { Platform } from 'react-native';
import Demo from '../../resources/persistence/demo/Demo';
import MobileServiceManager from '../../components/mobile-service/MobileServiceManager';
import AuthenticateRequestController from '../AuthenticateRequest';
import { MaintenanceStatus } from '../../resources/constants';

export interface RequestParams {
  [name: string]:
    | string
    | string[]
    | null
    | number
    | boolean
    | undefined
    | RequestParams[]
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
  requireValidation?: boolean;
}

export interface ResponseBody<T> {
  code: string;
  message: string;
  data: T;
  statusCode?: string;
}

export interface ResponseThirdPartiesBody<T> {
  code: string;
  message: string;
  idTransaction: string;
  data: T;
}

export interface ResponseTransactionBody<T> {
  code: string;
  message: string;
  idTransaction: string;
  data: T;
}

export interface ResponseAccountBody<T> {
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

type StartRequestParams = string;
type StartRequestResponse = string;

const TAG = '[Request]';
export default class Request {
  static token = '';

  static async prepare(path: string, params?: RequestParams) {
    let posicionPrepare = ''
    try {
    if (!Validate.isFunctionsEnabled()) {
      return;
    }

    let startRequestGms;
    let startRequestHms: any = {};
    const data = JSON.stringify({
      path,
      idActivity: params && params.idActivity ? params.idActivity : undefined,
      parent: Request.token,
    });

    const pair = await RSA.convertPKCS12ToKeyPair(Config.rsa.p12,Config.rsa.passphrase);

    const payload = await RSA.encryptOAEP(
      data,
      '',
      Hash.SHA512,
      pair.publicKey
    );

    Log.debug(TAG, 'prepare', 'startRequest', payload);

    let tokenData;

    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      const metric = perf().newTrace('RequestPrepare');
      await metric.start();
      Log.debug(TAG, 'prepare', 'firebasefunctions-gms');
      startRequestGms = functions().httpsCallable('startRequest');
      tokenData = await startRequestGms(payload);
      await metric.stop();
    } else {
      startRequestHms = await AuthenticateRequestController.startRequest(
        payload
      );
      tokenData = startRequestHms.body;
    }

    Log.debug(TAG, 'prepare', 'tokenGenerated', tokenData.data);
    Request.token = tokenData.data;
    Log.debug(TAG, 'prepare', 'startRequest', 'token', Request.token);
    return {
      responseMensaje:'ok',
      error:null
    }
    } catch (error) {

      const errAny =  (error as any)  

      const msjErr= errAny?.message?errAny.message:'No message';
        return {
          responseMensaje:`posicionPrepare:${posicionPrepare} | error:${msjErr}`,
          error:error
        }
    }
  }

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
    const isInRevision = await Validate.isInRevision();
    if (isInRevision) {
      return this.mockRequest<T>(RequestMethod.GET, path, params, true);
    }
    if (Config.settings.maintenanceMode) {
      throw new Error();
    }
    const url = this.getUrl(path);
    try {
      Log.debug(TAG, 'get', url);
      const requestBody = params ? JSON.stringify(params) : undefined;
      options.requireValidation && (await this.prepare(path, params));

      const response = await pinch.fetch(url, {
        ...fetchOptions,
        method: RequestMethod.GET,
        headers: await this.getHeaders(
          fetchOptions.headers,
          options,
          requestBody
        ),
        timeoutInterval: Request.getTimeout(),
        sslPinning: Request.getSSLPinning(),
        mutualAuth: Request.getMutualAuth(),
      });
      const body = await response.json();
      const status = response.status;
      const headers = response.headers;

      return {
        body,
        headers,
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
    const url = this.getUrl(path);
    !skipRegisterActivity && (await Session.registerActivity());

    const isInRevision = await Validate.isInRevision();
    if (isInRevision) {
      return this.mockRequest<T>(RequestMethod.POST, path, params, true);
    }
    if (
      Config.settings.maintenanceMode &&
      Config.settings.maintenanceStatus === MaintenanceStatus.Total
    ) {
      throw new Error();
    }

    let response:any = {}
    try {
      const requestBody = params ? JSON.stringify(params) : undefined;

    if(!!options.requireValidation){
      const responsePrepare=await this.prepare(path, params);
      response = {responseMensaje:responsePrepare?.responseMensaje}
      if(!!responsePrepare && !!responsePrepare.error){
        throw responsePrepare.error
      }
    }
        
      const requestHeaders = await this.getHeaders(
        fetchOptions.headers,
        options,
        requestBody
      );

      if (Validate.isDemo()) {
        const respuesta = await this.mockRequest<T>(
          RequestMethod.POST,
          path,
          params
        );
        return respuesta;
      }
      const paramsData = {
        ...fetchOptions,
        method: RequestMethod.POST,
        body: requestBody,
        headers: requestHeaders,
        timeoutInterval: Request.getTimeout(),
        sslPinning: Request.getSSLPinning(),
        mutualAuth: Request.getMutualAuth(),
      };
      response = await pinch.fetch(url, paramsData);
      const body = await response.json();
      const status = response.status;
      const headers = response.headers;

      return {
        body,
        headers,
        status,
      };
    } catch (e) {
      const error = new CodeError(TAG, 'post', e);
      Log.exception(TAG, 'post', error);
      let requestHeaders: any = {};
      try {
        const requestBody = params ? JSON.stringify(params) : undefined;
        requestHeaders = await this.getHeaders(
          fetchOptions.headers,
          options,
          requestBody
        );
      } catch (err) {
        
      }
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
    const isInRevision = await Validate.isInRevision();
    if (isInRevision) {
      return this.mockRequest<T>(RequestMethod.DELETE, path, params, true);
    }
    if (Config.settings.maintenanceMode) {
      throw new Error();
    }

    const url = this.getUrl(path);

    try {
      Log.debug(TAG, 'delete', url);
      options.requireValidation && (await this.prepare(path, params));

      const response = await pinch.fetch(url, {
        ...fetchOptions,
        method: RequestMethod.DELETE,
        headers: await this.getHeaders(fetchOptions.headers, options),
        timeoutInterval: Request.getTimeout(),
        sslPinning: Request.getSSLPinning(),
        mutualAuth: Request.getMutualAuth(),
      });
      const body = await response.json();
      const status = response.status;
      const headers = response.headers;

      return {
        body,
        headers,
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
    const isInRevision = await Validate.isInRevision();
    if (isInRevision) {
      return this.mockRequest<T>(RequestMethod.PUT, path, params, true);
    }
    if (Config.settings.maintenanceMode) {
      throw new Error();
    }

    const url = this.getUrl(path);

    try {
      Log.debug(TAG, 'put', url);
      options.requireValidation && (await this.prepare(path, params));

      const response = await pinch.fetch(url, {
        ...fetchOptions,
        method: RequestMethod.PUT,
        headers: await this.getHeaders(fetchOptions.headers, options),
        timeoutInterval: Request.getTimeout(),
        sslPinning: Request.getSSLPinning(),
        mutualAuth: Request.getMutualAuth(),
      });
      const body = await response.json();
      const status = response.status;
      const headers = response.headers;

      return {
        body,
        headers,
        status,
      };
    } catch (e) {
      const error = new CodeError(TAG, 'put', e);
      Log.exception(TAG, 'put', error);
      throw error;
    }
  }

  private static async getHeaders(
    headers?: RequestHeaders,
    options?: RequestOptions,
    body?: string
  ) {
    let sign;
    let token;

    if (options && options.requireValidation && Validate.isFunctionsEnabled()) {
      token = Request.token || '';
      const message = (body || '') + token;
      const pair = await RSA.convertPKCS12ToKeyPair(Config.rsa.p12,Config.rsa.passphrase);

      sign = await RSA.signPSS(
        message,
        Hash.SHA512,
        SaltLength.AUTO,
        pair.privateKey
      );
    }
    const buildId = await DeviceInfo.getBuildId();
    const manufacturer = await DeviceInfo.getManufacturer();
    const header = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': Config.server.subscriptionKey,
      'Ocp-Apim-Trace': true,
      'X-Foo-To': token,
      'X-Bar-Si': sign,
      'X-Build-Id': buildId,
      'X-Manufacturer': manufacturer,
      'X-Mobile-Service':
        MobileServiceManager.isGms || Platform.OS === 'ios' ? 'gms' : 'hms',
      // 'Authorization': token,
      'X-Model':
        Platform.OS === 'ios'
          ? DeviceInfo.getDeviceId()
          : DeviceInfo.getModel(),
      Envid: Config.server.Envid,
      ...(headers || []),
    };
    return header;
  }

  private static getUrl(path: string) {
    if (path.includes('http')) {
      return path;
    }
    const url = `${Config.server.url}/${path}`;
    return url;
  }

  private static getTimeout() {
    return Config.settings.requestTimeout === 0
      ? undefined
      : Config.settings.requestTimeout;
  }

  private static getSSLPinning() {
    return Config.sslPinning || {};
  }

  private static getMutualAuth() {
    return Config.mutualAuth || {};
  }

  private static existFile(path: string, isRevision?: boolean) {
    try {
      const exists = isRevision
        ? this.getRevisionData()[path]
        : this.getMockData()[path];
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

  private static getMockData() {
    return (Config as any).mock;
  }

  private static getRevisionData() {
    return Demo as any;
  }

  private static mockRequest<T>(
    method: RequestMethod,
    path: string,
    params?: RequestParams,
    isRevision?: boolean
  ): Promise<Response<T>> {
    const uri = path.replace(Config.server.url, '');
    const mockData = isRevision ? this.getRevisionData() : this.getMockData();
    const body = params || {};

    const { dir, cachePath, cacheFallbackPath } = this.getCacheName(
      uri,
      method,
      body
    );

    const methodName = isRevision ? 'revisionMockRequest' : 'mockRequest';

    Log.debug(TAG, methodName, 'getCacheName', {
      uri,
      method,
      body,
      dir,
      cachePath,
      cacheFallbackPath,
    });
    const cacheDir = dir;
    const cacheFullPath = this.getPath(cacheDir, cachePath);
    const exist = this.existFile(cacheFullPath, isRevision);

    const cacheFallbackFullPath = this.getPath(cacheDir, cacheFallbackPath);
    const existFallback = this.existFile(cacheFallbackFullPath, isRevision);
    let useFallback = false;
    if (cacheFallbackFullPath) {
      useFallback = !exist ? existFallback : false;
    }
    if (exist || useFallback) {
      let data: any = {};
      if (useFallback) {
        Log.debug(
          TAG,
          methodName,
          'cacheFallbackFullPath',
          cacheFallbackFullPath
        );
        data = mockData[cacheFallbackFullPath];
      } else {
        Log.debug(TAG, methodName, 'cacheFullPath', cacheFullPath);
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

    Log.warn(TAG, methodName, 'missing', cacheFullPath);
    return new Promise(resolve => {
      resolve({
        body: ({ error: true } as any) as T,
        headers: {},
        status: 404,
      });
    });
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
