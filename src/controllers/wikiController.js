const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wikis");
const markdown = require("markdown").markdown;

module.exports = {
  publicWiki(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if (err) {
        console.log(err);
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", { wikis });
      }
    });
  },

  privateWiki(req, res, next) {
    wikiQueries.getPrivateWikis(req, (err, wikis) => {
      if (err) {
        console.log(err);
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/private", { wikis });
      }
    });
  },
  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();
    if (authorized) {
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },

  create(req, res, next) {
    let newWiki = {
      title: req.body.title,
      body: req.body.body,
      private: req.body.private,
      userId: req.user.id
    };
    wikiQueries.addWiki(newWiki, (err, wiki) => {
      console.log(err);
      if (err) {
        res.redirect(500, "/wikis/new");
      } else {
        res.redirect(303, `/wikis/${wiki.id}`);
      }
    });
  },

  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        let markdownWiki = {
          title: markdown.toHTML(wiki.title),
          body: markdown.toHTML(wiki.body),
          private: wiki.private,
          userId: wiki.userId,
          id: wiki.id
        };
        console.log(markdownWiki);
        res.render("wikis/show", { markdownWiki });
      }
    });
  },

  destroy(req, res, next) {
    wikiQueries.deleteWiki(req, (err, deletedRecordsCount) => {
      if (err) {
        res.redirect(500, `/wikis/${req.params.id}`);
      } else {
        res.redirect(303, `/wikis`);
      }
    });
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, wiki).edit();
        if (authorized) {
          res.render("wikis/edit", { wiki });
        } else {
          req.flash("You are not authorized to do that.");
          res.redirect(`/wikis/${req.params.id}`);
        }
      }
    });
  },

  update(req, res, next) {
    wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  }
};
