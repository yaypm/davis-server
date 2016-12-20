const UserModel = require('../lib/models/User.js');
/**
 * Make any changes you need to make to the database here
 */
export async function up () {
  await this('User').update(
      { "name.first" : { "$exists" : false } },
      { $set: { name: { first: '' } } });

  await this('User').update(
      { "name.last" : { "$exists" : false } },
      { $set: { name: { last: '' } } });
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down () {
  // Write migration here
}
