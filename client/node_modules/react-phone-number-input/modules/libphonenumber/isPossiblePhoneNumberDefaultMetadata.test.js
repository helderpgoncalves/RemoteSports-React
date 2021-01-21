import isPossiblePhoneNumber from './isPossiblePhoneNumberDefaultMetadata';
describe('isPossiblePhoneNumberDefaultMetadata', function () {
  it('should tell if phone numbers are possible', function () {
    isPossiblePhoneNumber('+1').should.equal(false);
    isPossiblePhoneNumber('+12133734253').should.equal(true);
    isPossiblePhoneNumber('+19999999999').should.equal(true);
  });
});
//# sourceMappingURL=isPossiblePhoneNumberDefaultMetadata.test.js.map