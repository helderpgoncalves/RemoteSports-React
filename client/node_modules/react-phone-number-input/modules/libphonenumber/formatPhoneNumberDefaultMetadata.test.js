import formatPhoneNumber, { formatPhoneNumberIntl } from './formatPhoneNumberDefaultMetadata';
describe('formatPhoneNumberDefaultMetadata', function () {
  it('should format phone numbers', function () {
    formatPhoneNumber('+12133734253', 'NATIONAL').should.equal('(213) 373-4253');
    formatPhoneNumber('+12133734253', 'INTERNATIONAL').should.equal('+1 213 373 4253');
    formatPhoneNumberIntl('+12133734253').should.equal('+1 213 373 4253');
  });
});
//# sourceMappingURL=formatPhoneNumberDefaultMetadata.test.js.map