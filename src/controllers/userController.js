const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const User = require("../db/models").User;
const wikiQueries = require("../db/queries.wikis");
const keyPublishable = process.env.PUBLISHABLE_KEY;

module.exports = {
  signUp(req, res, next) {
    res.render("users/sign_up");
  },
  create(req, res, next) {
    //#1
    let newUser = {
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    // #2

    User.findOne({ where: { email: newUser.email } }).then(user => {
      if (user) {
        const errors = [
          {
            location: "body",
            param: "email",
            msg: "is already in use",
            value: ""
          }
        ];
        req.flash("error", errors);
        res.redirect("back");
      } else {
        userQueries.createUser(newUser, (err, user) => {
          if (err) {
            req.flash("error", err);
            res.redirect("/users/sign_up");
          } else {
            // #3
            passport.authenticate("local")(req, res, () => {
              req.flash("notice", "You've successfully signed in!");
              res.redirect("/");
            });
          }
        });
      }
    });
  },
  signInForm(req, res, next) {
    res.render("users/sign_in");
  },
  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function() {
      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    });
  },
  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  show(req, res, next) {
    // #1
    userQueries.getUser(req.params.id, (err, result) => {
      // #2
      if (err || result.user === undefined) {
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        // #3
        res.render("users/show", { ...result });
      }
    });
  },
  upgradeForm(req, res, next) {
    res.render("users/membership", { keyPublishable });
  },
  upgrade(req, res, next) {
    userQueries.upgrade(req.params.id);
    res.render("users/payment_confirmation");
  },
  downgradeForm(req, res, next) {
    res.render("users/membership");
  },
  downgrade(req, res, next) {
    userQueries.downgrade(req.params.id);
    wikiQueries.downgradePrivateWikis(req);
    req.flash("notice", "You are not a premium user anymore");
    res.redirect("/");
  }
};
