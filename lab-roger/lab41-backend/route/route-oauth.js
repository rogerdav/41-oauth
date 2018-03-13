const superagent = require('superagent');
require('dotenv').config();
const GOOGLE_OAUTH_URL = 'https://www.googleapis.com/oauth2/v4/token';
const OPEN_ID_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
const Auth = require('../model/auth');



module.exports = function(router) {
  console.log('in route o auth before get route');

  router.get('/oauth/google', (req, res) => {
    console.log('in route google code', req.query.code);

    if(!req.query.code) {
      res.redirect(process.env.CLIENT_URL);
      console.log('in redirect');
    } else {

      return superagent.post(GOOGLE_OAUTH_URL)
        .type('form')
        .send({
          code: req.query.code,
          grant_type: 'authorization_code',
          client_id: process.env.GOOGLE_OAUTH_ID,
          client_secret: process.env.GOOGLE_OAUTH_SECRET,
          redirect_uri: `${process.env.API_URL}/oauth/google`,
        })
        .then(tokenRes => {
          console.log('token', tokenRes.body.access_token);
          if(!tokenRes.body.access_token)
            res.redirect(process.env.CLIENT_URL);

          const token = tokenRes.body.access_token;
          return superagent.get(OPEN_ID_URL)
            .set('Authorization', `Bearer ${token}`);

        })
        .then(openIDResponse => {
          let userFromGoogle = {
            username: openIDResponse.body.name,
            email: openIDResponse.body.email,
          };
          let user = new Auth(userFromGoogle);
          console.log('auth', user);
          // console.log('open id user', user);
          return  user.generateToken()
            .then(token => {
              console.log('user token', token);
              res.cookie('X-401d21-OAuth-Token', `${token}`);
              res.redirect(process.env.CLIENT_URL);
              
            });



        })
        .catch(error => {
          console.log('__ERROR__', error.message);
          res.cookie('X-401d21-OAuth-Token', '');
          res.redirect(process.env.CLIENT_URL + '?error=oauth');
        });
    }


   
  });
  
};