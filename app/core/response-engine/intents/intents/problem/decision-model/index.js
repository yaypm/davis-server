'use strict';

const training_model = [
	{'lang': 'en-us', 'error': false, 'tense': 'past',    'problems': 'zero', 'template': 'en-us/tense/past/zero'},
	{'lang': 'en-us', 'error': false, 'tense': 'past',    'problems': 'one',  'template': 'en-us/tense/past/one'},
	{'lang': 'en-us', 'error': false, 'tense': 'past',    'problems': 'many', 'template': 'en-us/tense/past/many'},
	{'lang': 'en-us', 'error': false, 'tense': 'present', 'problems': 'zero', 'template': 'en-us/tense/present/zero'},
	{'lang': 'en-us', 'error': false, 'tense': 'present', 'problems': 'one',  'template': 'en-us/tense/present/one'},
    {'lang': 'en-us', 'error': false, 'tense': 'present', 'problems': 'many', 'template': 'en-us/tense/present/many'},
	{'lang': 'en-us', 'error': false, 'tense': 'future',  'problems': 'zero', 'template': 'en-us/tense/future/zero'},
	{'lang': 'en-us', 'error': true,  'tense': null,      'problems': null,   'template': 'en-us/error'}
];

module.exports = training_model;