const expect = require("chai").expect;
const _ = require("lodash");

const TenantController = require("../src/lib/controllers/tenants");
const UserController = require("../src/lib/controllers/users");
const { createUser, tenantSpec } = require("./bootstrap");

describe("Tenants", () => {
  let user;
  beforeEach(async () => {
    user = await createUser();
  });

  it("should reject new tenant due to an invalid URL", async () => {
    const badTenant = _.cloneDeep(tenantSpec);
    badTenant.url = "thisisinvalid";
    try{
      await TenantController.create(user, badTenant);
    } catch (err) {
      expect(err.message).to.equal("Invalid tenant API URL!");
      return;
    }
    throw new Error("Should have failed due to an invalid URL!");
  });

  it("should reject new tenant due to a missing name", async () => {
    const badTenant = _.cloneDeep(tenantSpec);
    badTenant.name = "";
    try{
      await TenantController.create(user, badTenant);
    } catch (err) {
      expect(err.message).to.equal("A tenant name is required!");
      return;
    }
    throw new Error("Should have failed due to a missing name!");
  });

  it("should reject new tenant due to a missing token", async () => {
    const badTenant = _.cloneDeep(tenantSpec);
    badTenant.access.tokens = [];
    try{
      await TenantController.create(user, badTenant);
    } catch (err) {
      expect(err.message).to.equal("At least one valid API token is required!");
      return;
    }
    throw new Error("Should have failed due to a missing name!");
  });

  it("should reject new tenant due to duplicate entry", async () => {
    try{
      await TenantController.create(user, tenantSpec);
      await TenantController.create(user, tenantSpec);
    } catch (err) {
      expect(err.message).to.equal("This item has already been created!");
      return;
    }
    throw new Error("Should have failed due to a missing name!");
  });

  it("should successfully create a new tenant", async () => {
    const tenant = await TenantController.create(user, tenantSpec);
    const qtenant = await TenantController.getById(tenant._id);
    expect(tenant.name).to.be.equal(qtenant.name);
  });

  it("should successfully modify a tenant name", async () => {
    const name = "New tenant name";
    const tenant = await TenantController.create(user, tenantSpec);
    tenant.name = name
    await tenant.save();
    const qtenant = await TenantController.getById(tenant._id);
    expect(qtenant.name).to.be.equal(name);
  });

  it("should successfully add a second api token", async () => {
    const tenant = await TenantController.create(user, tenantSpec);
    expect(tenant.access.tokens.length).to.be.equal(1);
    tenant.access.tokens.push("test");
    await tenant.save();
    const qtenant = await TenantController.getById(tenant._id);
    expect(tenant.access.tokens.length).to.be.equal(2);
  });

  it("should successfully return the API URL", async () => {
    const apiUrl = "https://thisisa.test";
    const tenant = await TenantController.create(user, tenantSpec);
    tenant.apiUrl = apiUrl;
    await tenant.save();
    const qtenant = await TenantController.getById(tenant._id);
    const quser = await UserController.getById(user._id);
    expect(quser.dynatraceApiUrl).to.be.equal(apiUrl);
    expect(quser.dynatraceUrl).to.be.equal(tenant.url);
  });

  it("should successfully add an admin user to the tenant", async () => {
    const user2 = await UserController.create({
      email: "test2@test.com",
      firstName: "test",
      lastName: "Town",
      password: "secret",
    });
    const tenantSpec2 = {
      url: "http://testtenant.com",
      name: "another test tenant",
      access: {
        tokens: ["test"],
      }
    }
    const tenant = await TenantController.create(user, tenantSpec);
    const tenant2 = await TenantController.create(user, tenantSpec2);
    user = await UserController.getById(user._id);
    await TenantController.update(user, user.tenant,{ admins: [user2._id] });
    const quser1 = await TenantController.getAll(user);
    const quser2 = await TenantController.getAll(user2);
    expect(quser1.length).to.equal(2);
    expect(quser2.length).to.equal(1);
  });

  it("should reject deletion by a non owner", async () => {
    const user2 = await UserController.create({
      email: "test2@test.com",
      firstName: "test",
      lastName: "Town",
      password: "secret",
    });

    const tenant = await TenantController.create(user, tenantSpec);

    try {
      await TenantController.delete(user2, tenant._id);
    } catch (err) {
      expect(err.message).to.equal("You don't have the required permissions to delete this tenant.");
      return;
    }
    throw new Error("Should have failed due to an unauthorized tenant deletion");
  });
});
