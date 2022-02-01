const { describe, it } = require('mocha');
const { expect } = require('chai');

const { InvalidRegexError, evaluteRegex } = require('./../src/util');

describe('Util Suite Tests', () => {
  it('#evaluteRegex should throw an error using an unsafe regex', () => {
      const unsafeRegex = /^([a-zA-Z|0-9]+\s?)+$/;

      expect(() => evaluteRegex(unsafeRegex)).to.throw(InvalidRegexError, `This ${unsafeRegex} is unsafe, Milorde!`);
  })
});
