"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isValidPhoneNumber;

var _core = require("libphonenumber-js/core");

function isValidPhoneNumber(value, metadata) {
  if (!value) {
    return false;
  }

  var phoneNumber = (0, _core.parsePhoneNumberFromString)(value, metadata);

  if (!phoneNumber) {
    return false;
  }

  return phoneNumber.isValid();
}
//# sourceMappingURL=isValidPhoneNumber.js.map