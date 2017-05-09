const expect = require("chai").expect;
const _ = require("lodash");

const UsersController = require("../src/lib/controllers/users");
const { userSpec } = require("./bootstrap");

describe("Users", () => {
  it("should reject new user due to short password", async () => {
    const badUser = _.cloneDeep(userSpec);
    badUser.password = "hi";
    try{
      await UsersController.create(badUser);
    } catch (err) {
      expect(err.message).to.equal("Passwords must be at least 6 characters!");
      return;
    }
    throw new Error("Should have failed due to a short password!");
  });

  it("should reject new user due to bad email address", async () => {
    const badUser = _.cloneDeep(userSpec);
    badUser.email = "thisisnotanemail";
    try{
      await UsersController.create(badUser);
    } catch (err) {
      expect(err.message).to.equal("Invalid email address!");
      return;
    }
    throw new Error("Should have failed due to a bad email address!");
  });

  it("should reject new user due to an empty first name", async () => {
    const badUser = _.cloneDeep(userSpec);
    badUser.firstName = "";
    try{
      await UsersController.create(badUser);
    } catch (err) {
      expect(err.message).to.equal("A first name is required!");
      return;
    }
    throw new Error("Should have failed due to an empty first name!");
  });

  it("should reject new user due to an empty last name", async () => {
    const badUser = _.cloneDeep(userSpec);
    badUser.lastName = "";
    try{
      await UsersController.create(badUser);
    } catch (err) {
      expect(err.message).to.equal("A last name is required!");
      return;
    }
    throw new Error("Should have failed due to an empty last name!");
  });

  it("should reject new user due to an invalid timezone", async () => {
    const badUser = _.cloneDeep(userSpec);
    badUser.timezone = "thisiswrong";
    try{
      await UsersController.create(badUser);
    } catch (err) {
      expect(err.message).to.equal(`'${badUser.timezone}' is an invalid timezone.`);
      return;
    }
    throw new Error("Should have failed due to an invalid timezone!");
  });

  it("should reject new user due to duplicate entry", async () => {
    try {
      await UsersController.create(userSpec);
      await UsersController.create(userSpec);
    } catch (err) {
      expect(err.message).to.equal("User already exists!");
      return;
    }
    throw new Error("Should have failed due to duplicate user!");
  });

  it("should successfully create a new user", async () => {
    const user = await UsersController.create(userSpec);
    const quser = await UsersController.getById(user._id);
    expect(user.email).to.be.equal(quser.email);
  });
});
