const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
      .then(user => {
        const msg = {
          to: newUser.email,
          from: "donotreply@blocipedia.com",
          subject: "User Confirmation",
          text: "Welcome to Blocipedia!",
          html:
            "<strong>Please login to your account to confirm membership!</strong>"
        };
        // console.log(process.env.SENDGRID_API_KEY);
        sgMail.send(msg);
        callback(null, user);
      })
      .catch(err => {
        callback(err);
      });
  },
  upgrade(id, callback) {
    return User.findById(id)
      .then(user => {
        if (!user) {
          return callback("User does not exist!");
        } else {
          return user.updateAttributes({ role: "premium" });
        }
      })
      .catch(err => {
        callback(err);
      });
  },
  downgrade(id, callback) {
    return User.findById(id)
      .then(user => {
        if (!user) {
          return "User does not exist";
        } else {
          return user.updateAttributes({ role: "standard" });
        }
      })
      .catch(err => {
        callback(err);
      });
  }
};
