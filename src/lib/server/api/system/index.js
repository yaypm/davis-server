const Router = require("express").Router;
const Users = require("../../../controllers/users");

const system = Router();

system.get("/users", async (req, res) => {
  const users = await Users.getAll();

  res.json(users.map((user) => ({
    first: user.firstName,
    last: user.lastName,
  })));
});

module.exports = system;
