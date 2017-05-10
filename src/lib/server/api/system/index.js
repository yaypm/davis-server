const Router = require("express").Router;
const Users = require("../../../controllers/users");

const version = require("../../../../../package.json").version;

const system = Router();

system.get("/version", (req, res) => {
  res.json({
    success: true,
    version,
  });
});

system.get("/user", (req, res) => {
  res.json({
    success: true,
    email: req.user.email,
    name: {
      first: req.user.firstName,
      last: req.user.lastName,
    },
    timezone: req.user.timezone,
  });
});

// TODO secure route
system.get("/users", async (req, res) => {
  const users = await Users.getAll();

  res.json(users.map(user => ({
    email: user.email,
    name: {
      first: user.firstName,
      last: user.lastName,
    },
    timezone: user.timezone,
  })));
});

module.exports = system;
