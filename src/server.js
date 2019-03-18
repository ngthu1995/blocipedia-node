const app = require("./app");
const http = require("http");
const server = http.createServer(app);

server.listen(4000);
server.on("listening", () => {
  console.log("server is listening for request on port 4000");
});
