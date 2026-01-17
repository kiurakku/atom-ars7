// Use @electron/remote for Electron 12+ compatibility
let remote;
try {
  remote = require('@electron/remote');
} catch (e) {
  // Fallback to electron.remote for older Electron versions
  remote = require('electron').remote;
}
module.exports = remote;

const Grim = require('grim');
Grim.deprecate(
  'Use `require("electron").remote` instead of `require("remote")`'
);

// Ensure each package that requires this shim causes a deprecation warning
delete require.cache[__filename];
