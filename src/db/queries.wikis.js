const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/wikis.js");

module.exports = {
  getAllWikis(callback) {
    return Wiki.all()

      .then(wikis => {
        callback(null, wikis);
      })
      .catch(err => {
        callback(err);
      });
  },

  addWiki(newWiki, callback) {
    return Wiki.create(newWiki)
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },

  getWiki(id, callback) {
    return Wiki.findById(id)
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },

  deleteWiki(req, callback) {
    // #1
    return Wiki.findById(req.params.id)
      .then(wiki => {
        // #2
        const authorized = new Authorizer(req.user, wiki).destroy();

        if (authorized) {
          // #3
          wiki.destroy().then(res => {
            callback(null, wiki);
          });
        } else {
          // #4
          req.flash("notice", "You are not authorized to do that.");
          callback(401);
        }
      })
      .catch(err => {
        callback(err);
      });
  },

  updateWiki(id, updatedWiki, callback) {
    return Wiki.findById(id).then(wiki => {
      if (!wiki) {
        return callback("Wiki not found");
      }

      wiki
        .update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch(err => {
          callback(err);
        });
    });
  }
};
