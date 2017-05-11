const expect = require("chai").expect;
const _ = require("lodash");
const nock = require("nock");

const AliasController = require("../src/lib/controllers/aliases");
const Dynatrace = require("../src/lib/core/dynatrace");

const { applications } = require("./data/applications");
const { createUserWithTenant, appAliasSpec, serviceAliasSpec } = require("./bootstrap");

describe("Aliases", () => {
  let user;
  beforeEach(async () => {
    ({ user } = await createUserWithTenant());
  });

  after(() => nock.cleanAll());

  it("should reject new alias due to a missing entity ID", async () => {
    const badAlias = _.cloneDeep(appAliasSpec);
    delete badAlias.entityId;
    try{
      await AliasController.create(user, badAlias);
    } catch (err) {
      expect(err.message).to.equal("An entity ID is required!");
      return;
    }
    throw new Error("Should have failed due to a missing entity ID!");
  });

  it("should reject new alias due to to duplicate entry", async () => {
    try{
      await AliasController.create(user, appAliasSpec);
      await AliasController.create(user, appAliasSpec);
    } catch (err) {
      expect(err.message).to.equal("This item has already been created!");
      return;
    }
    throw new Error("Should have failed due to a missing entity ID!");
  });

  it("should successfully create two new aliases", async () => {
    const appAlias = await AliasController.create(user, appAliasSpec);
    const serviceAlias = await AliasController.create(user, serviceAliasSpec);
    const confAppAlias = await AliasController.getById(appAlias._id);
    const confServiceAlias = await AliasController.getById(serviceAlias._id);
    expect(confAppAlias.entityId).to.equal(appAlias.entityId);
    expect(confServiceAlias.entityId).to.equal(serviceAlias.entityId);
  });

  it("should successfully allow an alias that matches a service", async () => {
    const aliasTag = "this is a test";
    const appAlias = await AliasController.create(user, appAliasSpec);
    const serviceAlias = await AliasController.create(user, serviceAliasSpec);
    appAlias.aliases.push(aliasTag);
    await appAlias.save();
    serviceAlias.aliases.push(aliasTag);
    await serviceAlias.save();
    const confAppAlias = await AliasController.getById(appAlias._id);
    const confServiceAlias = await AliasController.getById(serviceAlias._id);
    expect(confAppAlias.aliases[1]).to.equal(aliasTag);
    expect(confServiceAlias.aliases[1]).to.equal(aliasTag);
  });

  it("should reject new alias tag due to duplicate entry", async () => {
    const aliasTag = "this is a test";
    try{
      const secondaryEID = "APPLICATION-0CB08EBCB23C8D3B";
      const appAlias1 = await AliasController.create(user, appAliasSpec);
      const appAlias2 = await AliasController.create(user, { entityId: secondaryEID });
      await AliasController.update(user, appAlias1._id, { entityId: appAliasSpec.entityId, aliases: [aliasTag] });
      await AliasController.update(user, appAlias2._id, { entityId: secondaryEID, aliases: [aliasTag] });
    } catch (err) {
      expect(err.message).to.equal(`The alias '${aliasTag}' already refers to another application (${appAliasSpec.entityId}).`);
      return;
    }
    throw new Error("Should have failed due to a missing entity ID!");
  });

  it("should successfully merge the alias on the entity", async () => {
    nock(/dynatrace/i)
      .get("/api/v1/entity/applications")
      .reply(200, applications);
    
    await AliasController.create(user, appAliasSpec);
    const aliases = await Dynatrace.getApplications(user);
    const modifiedAlias = aliases.find((alias) => alias.entityId === appAliasSpec.entityId);
    expect(modifiedAlias.audible).to.equal(appAliasSpec.audible);

  });

});
