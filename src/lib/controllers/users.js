const bcrypt = require("bcrypt");
const UserModel = require("../models/user");

/**
 * User controller
 *
 * @class Users
 */
class Users {
  /**
   * Get a list of all users
   *
   * @static
   * @returns {Promise<IUserModel[]>}
   *
   * @memberOf Users
   */
  static async getAll() {
    return UserModel.find({});
  }

  /**
   * Get a user by MongoID
   *
   * @static
   * @param {string} id
   * @returns {Promise<IUserModel>}
   *
   * @memberOf Users
   */
  static async getById(id) {
    return UserModel.findById(id);
  }

  /**
   * Create a new user
   *
   * @static
   * @param {IUser} user
   * @returns {Promise<IUserModel>}
   *
   * @memberOf Users
   */
  static async create(user) {
    const checkUser = await UserModel.findOne({ email: user.email }).select("_id");

    if (checkUser) {
      throw new Error("User already exists!");
    }

    user.password = await bcrypt.hash(user.password, 10);
    const model = new UserModel(user);
    return model.save();
  }

  /**
   * Log in a user
   *
   * @static
   * @param {string} email
   * @param {string} password
   * @returns {(Promise<IUserModel | null>)}
   *
   * @memberOf Users
   */
  static async logIn(email, password) {
    const user = await UserModel.findOne({ email }).select("_id email password");

    if (!user) {
      return null;
    }

    const valid = await user.checkPass(password);

    if (valid) {
      return user;
    }
    return null;
  }
}

module.exports = Users;
