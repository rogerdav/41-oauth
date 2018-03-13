'use strict';

const server = require('../../lib/server');
const superagent = require('superagent');
const auth = require('../../model/auth');
const mocks = require('./mocks');
const faker = require('faker');
require('jest');

describe('POST /api/v1/signup', function() {
  beforeAll(() => server.start());
  beforeAll(() => mocks.auth.createOne()
    .then(data => {
      this.mockUser = data;
    }
    ));
  afterAll(() => server.stop());
  afterAll(mocks.auth.removeAll);

  describe('valid requests', () => {
    beforeAll(() => {
      return superagent.post(`:${process.env.PORT}/api/v1/signup`)
        .send(mocks.auth.createForPost())
        .then(res => this.response = res);
    });


    it('should return a status code of 201 CREATED', () => {
      expect(this.response.status).toBe(201);
    });
    it('should return a 400 code if no username', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/signup`)
        .send({
          username:'',
          password: 'hello',
          email: 'r@r.com',
        })
        .catch((response) => {
          expect(response.status).toBe(400);
        });
    });
   
   
  });
  
});

