const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// console.log(process.env.SENDGRID_API_KEY);

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
  }
};
