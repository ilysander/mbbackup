import {Platform, PlatformOSType} from 'react-native';
import Session from '../../api/Session';

declare let global: any;

export function withGlobal(
  name: string,
  value: any,
  callback: () => Promise<void> | void,
) {
  return async () => {
    const currentValue = global[name];
    global[name] = value;
    /* NOSONAR */
    await callback();
    global[name] = currentValue;
  };
}

export function withDev(value: boolean, callback: () => Promise<void> | void) {
  return withGlobal('__DEV__', value, callback);
}

export function withTest(value: boolean, callback: () => Promise<void> | void) {
  return withGlobal('__TEST__', value, callback);
}

export function withCatch(
  value: boolean,
  callback: () => Promise<void> | void,
) {
  return withGlobal('__CATCH__', value, callback);
}

export interface FetchConfig {
  session: 'status-code' | 'default' | 'error' | 'empty';
  useAuth?: boolean;
  cache?: string;
}

export function withFetchConfig(
  config: FetchConfig,
  callback: () => Promise<void> | void,
) {
  return async () => {
    const name = '__FETCH_CONFIG__';
    const currentValue = {...global[name]};
    global[name] = {...global[name], ...config};
    /* NOSONAR */
    await callback();
    global[name] = currentValue;
  };
}

export function withPlatform(
  value: PlatformOSType,
  callback: () => Promise<void> | void,
) {
  return async () => {
    const currentValue = Platform.OS;
    // Platform.OS = value;
    /* NOSONAR */
    await callback();
    Platform.OS = currentValue;
  };
}

export function withAuth(
  token: string | undefined,
  callback: () => Promise<void> | void,
) {
  return async () => {
    const name = '__FETCH_CONFIG__';
    const currentAuthValue = global[name].useAuth;
    const currentValue = Session.accessToken;
    Session.accessToken = token || '';
    global[name].useAuth = true;
    /* NOSONAR */
    await callback();
    Session.accessToken = currentValue;
    global[name].useAuth = currentAuthValue;
  };
}
