var http = require("http");
var port = process.env.PORT || process.env.VCAP_APP_PORT || 8090;
var server = http.createServer();

server.on("request", (req, res) => {
  res.on("error", (err) => {
    console.error(err);
  });

  if (req.url == "/now") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ now: new Date() }));
    res.end();
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("example page\n");
    res.end("Hello World\n");
  }
});

server.listen(port);
console.log("http server listening on %d", port);

const dns = require('dns');
var net = require("net");
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ server: server });

wss.on("connection", function (ws) {
  var client = new net.Socket();
  
  var addr = { host: "208.65.90.21", port: 4145 };

  client.connect(addr.port, addr.host);
  client.on("connect", function () {
    console.log("client:connect: " + addr.host);
  });

  client.on("error", function (ex) {
    console.log("Ошибка сокета " + ex);
  });

  client.on("data", function (data) {
    //console.log(data.toString());
    if (ws.readyState == ws.OPEN) {
      ws.send(data);
    }
  });

  client.on("close", function () {
    console.log("client:close: " + addr.host);
    ws.close();
    client.destroy(); // kill client after server's response
  });

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  ws.on("message", function incoming(message, isBinary) {
    if (isBinary == true){
       client.write(message);
    }
  });

  ws.on("close", function () {
    //console.log("ws:close");
    //ws.destroy();
    client.destroy();
  });

  ws.on("error", function (ex) {
    console.log("Ошибка вебоокета " + ex);
  });
});
