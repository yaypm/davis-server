
const UserModel = require("../src/lib/models/user");
const TenantModel = require("../src/lib/models/tenant");

const tenantSpec = {
  url: process.env.DYNATRACE_URL,
  name: "Mocha Tenant",
  access: {
    active: 0,
    tokens: [process.env.DYNATRACE_TOKEN],
  }
}

const userSpec = {
  email: "test@test.test",
  firstName: "Test",
  lastName: "McTesterson",
  password: "testpass",
  timezone: "Etc/UTC",
};

const createUser = async () => {
  const user = new UserModel(userSpec);
  return await user.save()
}

const createTenant = async (user) => {
  tenantSpec.owner = user._id;
  const tenant = new TenantModel(tenantSpec);
  return await tenant.save();
}

const createUserWithTenant= async () => {
  const user = new UserModel(userSpec);
  const outUser = await user.save()

  tenantSpec.owner = user._id;
  const tenant = new TenantModel(tenantSpec);
  const outTenant = await tenant.save();
  user.tenant = outTenant._id;
  return [outUser, outTenant];
}

module.exports = {
  createUser,
  createTenant,
  createUserWithTenant,
  tenantSpec,
  userSpec,
};