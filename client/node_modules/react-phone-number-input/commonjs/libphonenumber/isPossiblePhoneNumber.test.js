"use strict";

var _isPossiblePhoneNumber2 = _interopRequireDefault(require("./isPossiblePhoneNumber"));

var _metadataMin = _interopRequireDefault(require("libphonenumber-js/metadata.min.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function isPossiblePhoneNumber(value) {
  return (0, _isPossiblePhoneNumber2["default"])(value, _metadataMin["default"]);
}

describe('isPossiblePhoneNumber', function () {
  it('should tell if phone numbers are possible', function () {
    isPossiblePhoneNumber().should.equal(false);
    isPossiblePhoneNumber(null).should.equal(false);
    isPossiblePhoneNumber('').should.equal(false);
    isPossiblePhoneNumber('+1').should.equal(false);
    isPossiblePhoneNumber('+12133734253').should.equal(true);
    isPossiblePhoneNumber('+19999999999').should.equal(true);
  });
});
//# sourceMappingURL=isPossiblePhoneNumber.test.js.map