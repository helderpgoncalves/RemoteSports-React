"use strict";

var _isValidPhoneNumberDefaultMetadata = _interopRequireDefault(require("./isValidPhoneNumberDefaultMetadata"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('isValidPhoneNumberDefaultMetadata', function () {
  it('should validate phone numbers', function () {
    (0, _isValidPhoneNumberDefaultMetadata["default"])('+1').should.equal(false);
    (0, _isValidPhoneNumberDefaultMetadata["default"])('+12133734253').should.equal(true);
    (0, _isValidPhoneNumberDefaultMetadata["default"])('+19999999999').should.equal(false);
  });
});
//# sourceMappingURL=isValidPhoneNumberDefaultMetadata.test.js.map