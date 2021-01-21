"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _formatPhoneNumberDefaultMetadata = _interopRequireWildcard(require("./formatPhoneNumberDefaultMetadata"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

describe('formatPhoneNumberDefaultMetadata', function () {
  it('should format phone numbers', function () {
    (0, _formatPhoneNumberDefaultMetadata["default"])('+12133734253', 'NATIONAL').should.equal('(213) 373-4253');
    (0, _formatPhoneNumberDefaultMetadata["default"])('+12133734253', 'INTERNATIONAL').should.equal('+1 213 373 4253');
    (0, _formatPhoneNumberDefaultMetadata.formatPhoneNumberIntl)('+12133734253').should.equal('+1 213 373 4253');
  });
});
//# sourceMappingURL=formatPhoneNumberDefaultMetadata.test.js.map