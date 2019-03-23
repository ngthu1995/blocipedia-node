const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:4000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/dv/models").User;

describe("routes : wikis", () => {
  beforeEach(done => {
    this.user;
    this.wiki;
    sequelize.sync({ force: true }).then(res => {
      User.create({
        email: "user@example.com",
        password: "123456"
      }).then(user => {
        this.user = user;
        Wiki.create({
          title: "JS Frameworks",
          body: "There is a lot of them",
          private: false,
          userId: user.id
        })
          .then(wiki => {
            this.wiki = wiki;
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /wikis", () => {
    it("should return a status code 200 and all wikis", done => {
      //#3
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Wikis");
        done();
      });
    });
  });
});
