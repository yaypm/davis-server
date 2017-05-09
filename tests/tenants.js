const expect = require("chai").expect;
const _ = require("lodash");

const TenantsController = require("../src/lib/controllers/tenant");
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
      await TenantsController.create(user, badTenant);
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
      await TenantsController.create(user, badTenant);
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
      await TenantsController.create(user, badTenant);
    } catch (err) {
      expect(err.message).to.equal("At least one valid API token is required!");
      return;
    }
    throw new Error("Should have failed due to a missing name!");
  });

  it("should reject new tenant due to duplicate entry", async () => {
    try{
      await TenantsController.create(user, tenantSpec);
      await TenantsController.create(user, tenantSpec);
    } catch (err) {
      expect(err.message).to.equal("This item has already been created!");
      return;
    }
    throw new Error("Should have failed due to a missing name!");
  });

  it("should successfully create a new tenant", async () => {
    const tenant = await TenantsController.create(user, tenantSpec);
    const qtenant = await TenantsController.getById(tenant._id);
    expect(tenant.name).to.be.equal(qtenant.name);
  });

  it("should successfully modify a tenant name", async () => {
    const name = "New tenant name";
    const tenant = await TenantsController.create(user, tenantSpec);
    tenant.name = name
    await tenant.save();
    const qtenant = await TenantsController.getById(tenant._id);
    expect(qtenant.name).to.be.equal(name);
  });

  it("should successfully add a second api token", async () => {
    const tenant = await TenantsController.create(user, tenantSpec);
    expect(tenant.access.tokens.length).to.be.equal(1);
    tenant.access.tokens.push("test");
    await tenant.save();
    const qtenant = await TenantsController.getById(tenant._id);
    expect(tenant.access.tokens.length).to.be.equal(2);
  });

  it("should successfully return the API URL", async () => {
    const apiUrl = "https://thisisa.test";
    const tenant = await TenantsController.create(user, tenantSpec);
    tenant.apiUrl = apiUrl;
    await tenant.save();
    const qtenant = await TenantsController.getById(tenant._id);
    const quser = await UserController.getById(user._id);
    expect(quser.dynatraceApiUrl).to.be.equal(apiUrl);
  });
});
