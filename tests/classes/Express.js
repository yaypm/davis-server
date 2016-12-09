'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const Server = require('../../lib/server/Server');
const Davis = require('../../lib/Davis');

const davis = new Davis();
const server = new Server(davis);
const app = server.app;
const users = davis.users;

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.should();

describe('Express', () => {
  const adminemail = 'admin@localhost';
  const testemail = 'test@localhost';
  const name = { first: 'test', last: 'user' };

  const password = 'changeme';
  const admin = true;
  let token;

  before(() => {
    return davis.config.load();
  });

  // POST /api/v1/authenticate
  it('Should validate user on /api/v1/authenticate POST', () => {
    return chai.request(app)
      .post('/api/v1/authenticate')
      .set('Content-Type', 'application/json')
      .send({
        email: adminemail,
        name,
        password,
      })
      .then(res => {
        token = res.body.token;
        res.body.success.should.eql(true);
      });
  });

  it('Should reject invalid credentials', () => {
    return chai.request(app)
      .post('/api/v1/authenticate')
      .set('Content-Type', 'application/json')
      .send({
        email: adminemail,
        name,
        password: 'wrong',
      })
      .then(res => {
        res.body.success.should.eql(false);
      });
  });

  // GET|PUT /api/v1/system/config/:category(dynatrace|slack|watson)

  // GET /api/v1/system/users
  it('Should list all users', () => {
    return chai.request(app)
      .get('/api/v1/system/users')
      .set('Content-Type', 'application/json')
      .set('X-Access-Token', token)
      .then((res) => {
        res.body.users.length.should.eql(2);
      });
  });

  // POST|GET|PUT|DELETE /api/v1/system/users/:user_email
  it('Should create a user', () => {
    return chai.request(app)
      .post(`/api/v1/system/users/${testemail}`)
      .set('Content-Type', 'application/json')
      .set('X-Access-Token', token)
      .send({
        password,
        name,
        admin,
      })
      .then(res => {
        res.body.success.should.eql(true);
      });
  });

  it('Should reject default credentials after user creation', () => {
    return chai.request(app)
      .post('/api/v1/authenticate')
      .set('Content-Type', 'application/json')
      .send({
        email: adminemail,
        name,
        password,
      })
      .then(res => {
        res.body.success.should.eql(false);
      });
  });

  it('Should validate new user', () => {
    return chai.request(app)
      .post('/api/v1/authenticate')
      .set('Content-Type', 'application/json')
      .send({
        email: testemail,
        name,
        password,
      })
      .then(res => {
        token = res.body.token;
        res.body.success.should.eql(true);
      });
  });

  it('Should get a user', () => {
    return chai.request(app)
      .get(`/api/v1/system/users/${testemail}`)
      .set('X-Access-Token', token)
      .then((res) => {
        res.body.user.email.should.eql(testemail);
      })
  });

  it('Should modify a user', () => {
    return chai.request(app)
      .put(`/api/v1/system/users/${testemail}`)
      .set('X-Access-Token', token)
      .set('Content-Type', 'application/json')
      .send({
        timezone: 'America/Detroit',
      })
      .then((res) => {
        res.body.success.should.eql(true);
      });
  });

  it('Should not be able to delete the last admin', () => {
    return chai.request(app)
      .delete(`/api/v1/system/users/${testemail}`)
      .set('X-Access-Token', token)
      .set('Content-Type', 'application/json')
      .then((res) => {
        res.body.success.should.eql(false);
      });
  });

  it('Should create and delete a user', () => {
    return chai.request(app)
      .post(`/api/v1/system/users/deleteme@localhost`)
      .set('Content-Type', 'application/json')
      .set('X-Access-Token', token)
      .send({
        password,
        name,
        admin,
      })
      .then(res => {
        res.body.success.should.eql(true);
      })
      .then(() => {
        return chai.request(app)
          .delete(`/api/v1/system/users/deleteme@localhost`)
          .set('X-Access-Token', token)
          .set('Content-Type', 'application/json')
          .then((res) => {
            res.body.success.should.eql(true);
          });
      });
  });
});
