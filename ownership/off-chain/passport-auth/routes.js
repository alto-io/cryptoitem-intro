// app/routes.js
module.exports = function(app, passport) {

    app.get('/', function(req, res) {
      // render the page and pass in any flash data if it exists
      res.render(__dirname + '/../../../game/index.ejs', { message: req.flash('loginMessage') });

    });

    app.post('/login', function(req, res, next) {

      passport.authenticate('local-login', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }

        // Generate a JSON response reflecting authentication status
        if (! user) {
          return res.send({ success : false, message : 'authentication failed' });
        }
        // ***********************************************************************
        // "Note that when using a custom callback, it becomes the application's
        // responsibility to establish a session (by calling req.login()) and send
        // a response."
        // Source: http://passportjs.org/docs
        // ***********************************************************************
        req.login(user, loginErr => {
          if (loginErr) {
            return next(loginErr);
          }
          return res.send({ success : true, message : 'authentication succeeded', user: user });
        });
      })(req, res, next);
    });

    app.post('/signup', function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
          return res.send({ success : false, message : 'creation failed' });
        }
        req.login(user, loginErr => {
          if (loginErr) {
            return next(loginErr);
          }
          return res.send({ success : true, message : 'creation succeeded', user: user });
        });
      })(req, res, next);
    });

    app.get('/checkauth', isAuthenticated, function(req, res){

        res.status(200).json({
            status: 'Login successful!',
            user: req.user
        });
    });


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.post('/logout', function(req, res) {
        req.logout();
        res.status(200).json({
          status: 'Logout successful!'
        });
    });
};

function isAuthenticated(req,res,next){
   if(req.user)
      return next();
   else
      return res.status(401).json({
        error: 'User not authenticated'
      })
}
