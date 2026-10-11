/*
Copyright 2020. Huawei Technologies Co., Ltd. All rights reserved.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import { NativeModules, Platform } from 'react-native';
const { RNCrash } = NativeModules;
import tracking from 'promise/setimmediate/rejection-tracking';
import StackTrace from 'stacktrace-js';

export const LogLevel = {
    DEBUG: 2,
    INFO: 3,
    WARN: 4,
    ERROR: 5
}

export function once(fn, context) {
    let result;
    let flag = false;
    return function onceInner(...args) {
        if (!flag) {
            flag = true;
            result = fn.apply(context || this, args);
        }
        return result;
    };
}

export const setErrorHandler = once(() => {
    const originalHandler = ErrorUtils.getGlobalHandler();
    async function handler(error, fatal) {
        if (__DEV__) {
            return originalHandler(error, fatal);
        }
        try {
            const stackFrames = await StackTrace.fromError(error, { offline: true });
            await RNCrash.recordError(parseJsError(error, stackFrames, false));
        } catch (e) {
        }
        return originalHandler(error, fatal);
    }
    ErrorUtils.setGlobalHandler(handler);
    return handler;
});

export const setUnhandledPromiseHandler = once(() => {
    async function onUnhandled(id, error) {
        if (!__DEV__) {
            try {
                const stackFrames = await StackTrace.fromError(error, { offline: true });
                await RNCrash.recordError(parseJsError(error, stackFrames, true));
            } catch (e) {
            }
        }
    }
    tracking.enable({
        allRejections: true,
        onUnhandled,
    });
    return onUnhandled;
});

export function parseFileName(fileName) {
    let result = '<unknown>';
    if (fileName) {
        const len = fileName.indexOf('?');
        if (len < 0) {
            result = fileName;
        } else if (len > 0) {
            result = fileName.substring(0, len);
        }
    }
    return result;
}

export function parseJsError(error, stackFrames, isPromiseReject) {
    const native = {};
    native.message = error.message;
    native.isPromiseReject = isPromiseReject;
    native.frames = [];
    for (let i = 0; i < stackFrames.length; i++) {
        const { columnNumber, lineNumber, fileName, functionName, source } = stackFrames[i];
        fileName = parseFileName(fileName);
        native.frames.push({
            source: source,
            line: lineNumber || 0,
            col: columnNumber || 0,
            function: functionName || '<unknown>',
            file: `${fileName}:${lineNumber || 0}:${columnNumber || 0}`,
        });
    }
    return native;
}

export default class AGCCrash {
    static init() {
        setErrorHandler();
        setUnhandledPromiseHandler();
    }

    static testIt() {
        RNCrash.testIt();
    }

    static enableCrashCollection(enable) {
        RNCrash.enableCrashCollection(enable);
    }

    static setUserId(userId) {
        RNCrash.setUserId(userId);
    }

    static setCustomKey(key, value) {
        if (typeof (value) === 'number' || typeof (value) === 'string' || typeof (value) === 'boolean') {
            RNCrash.setCustomKey(key, value.toString());
        }
    }

    static log(message) {
        RNCrash.log(message);
    }

    static logWithLevel(logLevel, message) {
        if (Platform.OS === 'android') {
            logLevel = logLevel + 1;
        }
        RNCrash.logWithLevel(logLevel, message);
    }

    static recordError(error) {
        StackTrace.fromError(error, { offline: true }).then(stackFrames => {
            RNCrash.recordError(parseJsError(error, stackFrames, false));
        });
    }
}

AGCCrash.init();
