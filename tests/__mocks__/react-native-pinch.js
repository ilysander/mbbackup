import crypto from 'crypto';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import ConfigConst from '../../src/Config';
import { Log } from '../../src/resources/log';
function existFile(path) {
  try {
    const exists = fs.statSync(path);
    return !!exists;
  } catch (e) {
    return false;
  }
}
const Config = ConfigConst.default || ConfigConst;

function isEmpty(object) {
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) return false;
  }

  return JSON.stringify(object) === JSON.stringify({});
}

function getCacheName(uri, method, body, headers, config) {
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

  if (!isEmpty(body)) {
    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(body))
      .digest('hex');

    pathBlocks.push(hash.substring(10, 15));
  }
  const authorization = headers
    ? headers.Authorization || headers.authorization
    : '';
  if (config.useAuth && headers && authorization) {
    const hash = crypto
      .createHash('md5')
      .update(authorization)
      .digest('hex');

    pathBlocks.push('AUTH-' + hash.substring(10, 15));
  }

  const cachePath = pathBlocks.join('_') + '.cache';
  return { dir, cachePath };
}

function buildResponse(response) {
  return {
    json: async () => {
      return response.body;
    },
    text: async () => {
      return response.body;
    },
    status: response.statusCode,
    headers: response.headers
  };
}

function getPath(...dirs) {
  return dirs.filter(dir => !!dir).join(path.sep);
}
global.__FETCH_CONFIG__ = {
  cache: __dirname + '/../sessions',
  session: 'default',
  useAuth: false
};

const TAG = '[Pinch]';
export default class Pinch {
  static async fetch(url, request) {
    if (global.__CATCH__) {
      throw new Error('mock request from __CATCH__');
    }
    let response = {
      statusCode: 404,
      headers: {},
      body: {}
    };
    const uri = url.split(Config.server.url)[1];
    const method = request.method.toUpperCase();
    const body = request.body ? JSON.parse(request.body) : {};
    const headers = request.headers || {};
    const config = global.__FETCH_CONFIG__;

    if (url.includes('google.com')) {
      response.statusCode = 200;
      return buildResponse(response);
    }

    const { dir, cachePath } = getCacheName(uri, method, body, headers, config);
    const cacheDir = getPath(config.cache, config.session, dir);
    const dirPath = getPath(config.session, dir, cachePath);
    const cacheFullPath = getPath(cacheDir, cachePath);

    const exist = existFile(cacheFullPath);
    if (exist) {
      const data = JSON.parse(fs.readFileSync(cacheFullPath, 'utf8'));
      response = data.response;
    } else {
      Log.warn(
        TAG,
        'fetch',
        'missing cache file: ' +
        dirPath +
        ' URL: ' +
        uri +
        ' METHOD: ' +
        method,
        'creating mock...'
      );

      try {
        await mkdirp(cacheDir);
      } catch (e) { }

      fs.writeFileSync(
        cacheFullPath,
        JSON.stringify(
          {
            duration: 0,
            request: {
              url,
              method,
              headers,
              body
            },
            response
          },
          null,
          2
        ),
        'utf8'
      );
    }

    return buildResponse(response);
  }
}
