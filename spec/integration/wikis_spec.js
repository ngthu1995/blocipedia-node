const request = require("request");
const server = require("../../src/server");
const sequelize = require("../../src/db/models/index").sequelize;
const base = "http://localhost:4000/wikis/";

const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

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

  describe("GET /wikis/new", () => {
    it("should render a new wiki form", done => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Wiki");
        done();
      });
    });
  });

  describe("POST /wikis/create", () => {
    it("should create a new wiki and redirect", done => {
      const options = {
        url: `${base}/create`,
        form: {
          title: "Watching snow melt",
          body:
            "Without a doubt my favoriting things to do besides watching paint dry!",
          userId: 1
        }
      };
      request.post(options, (err, res, body) => {
        Wiki.findOne({ where: { title: "Watching snow melt" } })
          .then(wiki => {
            // expect(wiki).not.toBeNull();
            expect(wiki.title).toBe("Watching snow melt");
            expect(wiki.body).toBe(
              "Without a doubt my favoriting things to do besides watching paint dry!"
            );
            expect(post.topicId).not.toBeNull();
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });
});
