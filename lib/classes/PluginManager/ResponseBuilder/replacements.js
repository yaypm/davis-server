/*
 * List of replacements used for 'say' pronunciation.
 *
 * Any replacement with only one field will be treated as an acronym and spelled out.
 *
 * Any replacement with two fields will use the first field as the matcher and thes
 * second field as the replacement.
 *
 * Any regexp matcher will have flags are foced to 'ig'. Matching groups can be used
 * in the replacement text.
 *
 * Any string matcher will be turned into a case insensitive RegExp and have word
 * boundary markers attached on either end.
 */

module.exports = [
  // Replace URLs like https://dynatrace.com/blah/adsf/sa with 'dynatrace dot com'
  [/\b(https?:\/\/)?(\w+)\.(com|org|net)(\/[^\s.,]*)?/, '$2 dot $3'],
  // Replace two letter urls and unrecognized 3 letter urls like socket.io
  // with 'socket dot <spell>io</spell>'
  [/\b(https?:\/\/)?([a-zA-Z]+)\.(\w\w\w?)\b/, '$1 dot <say-as interpret-as="spell-out">$2</say-as>'],
  ['couchdb', 'Couch DB'],
  [/\.NET/, 'dot net'],
  ['DB'],
  ['API'],
  ['SQL'],
  ['Postgresql', 'Postgres <say-as interpret-as="spell-out">QL</say-as>'],
  ['MSSQL'],
  ['JS'],
];
