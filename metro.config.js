/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const blacklist = require('metro-config/src/defaults/exclusionList');

function toBool(input) {
  return /^\s*(true|1|on)\s*$/i.test(input);
}

const JSCramblerEnabled = toBool(process.env.JSCRAMBLER_ENABLE);
console.warn('JSCrambler:', JSCramblerEnabled ? 'enabled' : 'disabled');

module.exports = JSCramblerEnabled
  ? {
      ...require('jscrambler-metro-plugin')(),
      resolver: {
        blacklistRE: blacklist([/libraries\/.*/]),
      },
    }
  : {
      transformer: {
        getTransformOptions: async () => ({
          transform: {
            experimentalImportSupport: false,
            inlineRequires: false,
          },
        }),
      },
      resolver: {
        blacklistRE: blacklist([/libraries\/.*/]),
      },
    };
