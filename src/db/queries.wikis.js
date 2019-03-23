const Wiki = require("./models").Wiki;

module.exports = {
  getAllWikis(callback) {
    return Wiki.all()
      .then(wikis => {
        callback(null, callback);
      })
      .catch(err => {
        callback(err);
      });
  }
};
