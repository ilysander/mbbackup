import { withDev } from '../../resources/util/Tests';
import { CodeError } from '../error';
import Log from './Log';

const TAG = 'LOG';

it('log default', () => {
  Log.log('[TEST]', 'submit', 'test');
});
it('log warn', () => {
  Log.warn('[TEST]', 'submit', 'warn');
});
it('log error', () => {
  Log.error('[TEST]', 'submit', 'error');
});
it('log debug', () => {
  Log.debug('[TEST]', 'submit', 'debug');
});
it('log info', () => {
  Log.info('[TEST]', 'submit', 'info');
});
it('log exception', () => {
  Log.info('[TEST]', 'submit', 'exception');
});
it('log withStatusCode', () => {
  Log.withStatusCode('[TEST]', 'submit', {
    status: 500,
    body: undefined,
    headers: {},
  });
});

it('log default object', () => {
  Log.log('[TEST]', 'submit', { t: 'e', s: 't' });
});
it('log warn object', () => {
  Log.warn('[TEST]', 'submit', { t: 'e', s: 't' });
});
it('log error object', () => {
  Log.error('[TEST]', 'submit', { t: 'e', s: 't' });
});
it('log debug object', () => {
  Log.debug('[TEST]', 'submit', { t: 'e', s: 't' });
});
it('log info object', () => {
  Log.info('[TEST]', 'submit', { t: 'e', s: 't' });
});
it('log exception object', () => {
  const error = {
    isNetworkError: true,
    codeError: true,
    status: 422,
    body: {},
  };
  const functionName = 'log exception object';
  Log.exception(TAG, functionName, error);
});

it('log exception object false', () => {
  const error = {
    isNetworkError: false,
    codeError: false,
    status: 422,
    code: {},
  };
  const functionName = 'log exception object false';
  Log.exception(TAG, functionName, error);
});

it('log exception without code', () => {
  const error = {
    isNetworkError: false,
    codeError: false,
    status: 422,
    code: undefined,
  };
  const functionName = 'log exception without code';
  Log.exception(TAG, functionName, error);
});

it('log exception object with CodeError', () => {
  const error = new CodeError(
    'Log',
    'log exception object with CodeError',
    'an error has occurred'
  );
  Log.exception(error.tag, error.method, error);
});

it('log withStatusCode object', () => {
  const response = {
    status: 404,
    body: undefined,
    headers: {},
  };
  Log.withStatusCode('[TEST]', 'submit', response);
});

it('log withStatusCode object', () => {
  const response = {
    status: 500,
    body: undefined,
    headers: {},
  };
  Log.withStatusCode('[TEST]', 'submit', response);
});

it(
  'log default no __DEV__',
  withDev(false, () => {
    Log.log('[TEST]', 'submit', 'test');
  })
);
it(
  'log warn no __DEV__',
  withDev(false, () => {
    Log.warn('[TEST]', 'submit', 'warn');
  })
);
it(
  'log error no __DEV__',
  withDev(false, () => {
    Log.error('[TEST]', 'submit', 'error');
  })
);
it(
  'log debug no __DEV__',
  withDev(false, () => {
    Log.debug('[TEST]', 'submit', 'debug');
  })
);
it(
  'log info no __DEV__',
  withDev(false, () => {
    Log.info('[TEST]', 'submit', 'info');
  })
);
