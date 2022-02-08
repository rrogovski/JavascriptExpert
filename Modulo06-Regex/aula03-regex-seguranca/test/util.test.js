const { describe, it } = require('mocha');
const { expect } = require('chai');

const { InvalidRegexError, evaluteRegex } = require('./../src/util');

describe('Util Suite Tests', () => {
  it('#evaluteRegex should throw an error using an unsafe regex', () => {
      const unsafeRegex = /^([a-zA-Z|0-9]+\s?)+$/;

      // Teste ver o tempo que o node leva para executar o comando e se vai dar crash.
      /*
      /usr/bin/time -f "%E real,%U user,%S sys, %P proc" \
        node --eval "/^([a-zA-Z|0-9]+\s?)+$/.test('eaeee como vai voce e como vai voce?') && console.log('Vai dar crash?')"
      */

      /*
      /usr/bin/time -f "%E real,%U user,%S sys, %P proc" \
        node --eval "/^([a-zA-Z|0-9]+\s?)+$/.test('eaeee como vai voce e como vai voce e como vai voce?') && console.log('Vai dar crash?')"
      */

      expect(() => evaluteRegex(unsafeRegex)).to.throw(InvalidRegexError, `This ${unsafeRegex} is unsafe, Milorde!`);
  })

  it('#evaluateRegex should not throw an error using a safe regex', () => {
    const safeRegex = /^([a-z])$/;

    expect(() => evaluteRegex(safeRegex)).to.not.throw;
    expect(() => evaluteRegex(safeRegex)).to.be.ok;
  })
});
