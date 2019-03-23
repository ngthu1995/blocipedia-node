const wikiQueries = require("../db/queries.wikis");

module.exports = {
  test(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/wiki", { wikis });
      }
    });
  }
};
