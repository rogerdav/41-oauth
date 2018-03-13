'use strict';

const server = require('../../lib/server');
const superagent = require('superagent');
const auth = require('../../model/auth');
const mocks = require('./mocks');
const faker = require('faker');
require('jest');



describe('GET /api/v1/signin', function() {
  
  beforeAll(() => server.start());
  beforeAll(() => mocks.auth.createOne()
    .then(data => {
      this.mockUser = data;
      console.log('this mockdata', this.mockUser.user.username, this.mockUser.password);
      return superagent.get(`:${process.env.PORT}/api/v1/signin`)
        .auth(`${this.mockUser.user.username}:${this.mockUser.password}`)
        .then(res => {

          this.response = res;
          // it('should get a resposnse status of 200', () =>{
          //   expect(this.response.)
          // })
          console.log('this.response', this.response);
        });
    }));
  afterAll(() => server.stop());
    
    
  afterAll(() => {
    auth.remove({}, (err) => {
      if(err != null) console.error(err);
    });
  });

  it('should return a status code of 200 ', () => {
    // expect(res.body).not.toEqual('');
    expect(this.response.status).toBe(200);
  });
  

  it('should return a 401 code if no username', () => {
    return superagent.get(`:${process.env.PORT}/api/v1/signin`)
      .auth(`${this.mockUser.password}`)
      .catch((response) => {
        expect(response.status).toBe(401);
      });
  });
   
});
  
