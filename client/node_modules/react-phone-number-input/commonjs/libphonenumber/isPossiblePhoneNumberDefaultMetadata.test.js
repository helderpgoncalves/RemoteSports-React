"use strict";

var _isPossiblePhoneNumberDefaultMetadata = _interopRequireDefault(require("./isPossiblePhoneNumberDefaultMetadata"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('isPossiblePhoneNumberDefaultMetadata', function () {
  it('should tell if phone numbers are possible', function () {
    (0, _isPossiblePhoneNumberDefaultMetadata["default"])('+1').should.equal(false);
    (0, _isPossiblePhoneNumberDefaultMetadata["default"])('+12133734253').should.equal(true);
    (0, _isPossiblePhoneNumberDefaultMetadata["default"])('+19999999999').should.equal(true);
  });
});
//# sourceMappingURL=isPossiblePhoneNumberDefaultMetadata.test.js.map