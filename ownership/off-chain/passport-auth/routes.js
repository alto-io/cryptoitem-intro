// app/routes.js
module.exports = function(app, passport) {

    app.get('/', function(req, res) {
      console.log("user: " + res.user);

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
          return res.send({ success : true, message : 'authentication succeeded' });
        });
      })(req, res, next);
    });

    // process the login form
    /*
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    */

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
      app.post('/signup', passport.authenticate('local-signup', {
          successRedirect : '/profile', // redirect to the secure profile section
          failureRedirect : '/signup', // redirect back to the signup page if there is an error
          failureFlash : true // allow flash messages
      }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
