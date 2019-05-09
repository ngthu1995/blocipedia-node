const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:4000";

describe("routes : static", () => {
  describe("GET /", () => {
    it("should return status code 200 and have a title in the body", done => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body).toContain("Unlimited sky of knowledge");
        done();
      });
    });
  });
});
