"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isPossiblePhoneNumber;

var _core = require("libphonenumber-js/core");

function isPossiblePhoneNumber(value, metadata) {
  if (!value) {
    return false;
  }

  var phoneNumber = (0, _core.parsePhoneNumberFromString)(value, metadata);

  if (!phoneNumber) {
    return false;
  }

  return phoneNumber.isPossible();
}
//# sourceMappingURL=isPossiblePhoneNumber.js.map