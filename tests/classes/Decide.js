'use strict';

const chai = require('chai');
const Davis = require('../../lib/Davis');
const Decide = require('../../lib/classes/Decide')

chai.should();

describe('Decide', () => {
  describe('#constructor()', () => {
    const davis = new Davis();
    const decide = new Decide(davis);

    it('should return one past problem', () => {
      const output = decide.predict([
        { tense: 'past',    problem: 'zero', output: { template: 'past/zero' }},
        { tense: 'past',    problem: 'one',  output: { template: 'past/one' }},
        { tense: 'past',    problem: 'two',  output: { template: 'past/two' }},
        { tense: 'present', problem: 'zero', output: { template: 'present/zero' }},
        { tense: 'present', problem: 'one',  output: { template: 'present/one' }},
        { tense: 'present', problem: 'two',  output: { template: 'present/two' }},
      ], { tense: 'past', problem: 'zero' });

      output.template.should.equal('past/zero');
    });
  });
});
