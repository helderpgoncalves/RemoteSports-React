"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isValidPhoneNumber;

var _isValidPhoneNumber = _interopRequireDefault(require("./isValidPhoneNumber"));

var _metadataMin = _interopRequireDefault(require("libphonenumber-js/metadata.min.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Deprecated.
// This is a file used in the legacy root `/index.js` export file.
// (importing directly from `react-phone-number-input` is currently considered deprecated)
// In some next major version this file will be removed
// and `main` and `module` entries in `package.json` will be
// redirected to `/min/index.js` and `/min/index.commonjs.js`
// which don't import this file.
function isValidPhoneNumber() {
  var parameters = Array.prototype.slice.call(arguments);
  parameters.push(_metadataMin["default"]);
  return _isValidPhoneNumber["default"].apply(this, parameters);
}
//# sourceMappingURL=isValidPhoneNumberDefaultMetadata.js.map