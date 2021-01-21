"use strict";

var _isValidPhoneNumber2 = _interopRequireDefault(require("./isValidPhoneNumber"));

var _metadataMin = _interopRequireDefault(require("libphonenumber-js/metadata.min.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function isValidPhoneNumber(value) {
  return (0, _isValidPhoneNumber2["default"])(value, _metadataMin["default"]);
}

describe('isValidPhoneNumber', function () {
  it('should validate phone numbers', function () {
    isValidPhoneNumber().should.equal(false);
    isValidPhoneNumber(null).should.equal(false);
    isValidPhoneNumber('').should.equal(false);
    isValidPhoneNumber('+1').should.equal(false);
    isValidPhoneNumber('+12133734253').should.equal(true);
    isValidPhoneNumber('+19999999999').should.equal(false);
  });
});
//# sourceMappingURL=isValidPhoneNumber.test.js.map