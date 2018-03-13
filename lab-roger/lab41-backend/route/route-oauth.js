module.exports = function(router) {
  console.log('in route o auth before get route');

  router.get('/oauth/google', (req, res) => {
    console.log('in o auth route');
  });
};