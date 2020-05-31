const express = require("express");
const spdy = require("spdy");
const httpServer = require('http');
const path = require("path");
const logger = require("morgan");
const fs = require("fs");
const { readFile } = require("./fs-promises");
const { getAllFilesInfo } = require("./get-files-info");

const PATH_TO_BUILD_DIR = path.join(__dirname, "build");
const PATH_TO_HTML = path.join(PATH_TO_BUILD_DIR, "index.html");

const app = express();
const PORT = 8081;

const options = {
  key: fs.readFileSync(path.join(__dirname, 'certs',"privateKey.key")),
  cert: fs.readFileSync(path.join(__dirname, 'certs', "certificate.crt")),
};

app.use(logger("dev"));

app.use(async (req, res, next) => {
  const staticFilesMeta = global.staticFilesMeta;

  if(res.push){
    try {
      staticFilesMeta.slice(1).forEach(({ staticPath, fileData }, index) => {
        const stream = res.push(staticPath, {
          req: { accept: "**/*" },
        });
  
        stream.end(fileData);
      });
  
      const html = staticFilesMeta[0].fileData;
  
      res.writeHead(200);
      res.end(html);
      return;
    } catch (error) {
      console.log(error);
  
      res.writeHead(500);
      res.end();
    }
  } else{
    // write your usual server here =)
    next()
  }
});

getAllFilesInfo().then((staticFilesMeta) => {
  global.staticFilesMeta = staticFilesMeta;

  spdy.createServer(options, app).listen(PORT, (error) => {
    if (error) {
      console.error(error);
      return process.exit(1);
    } else {
      console.log(`HTTP/2 server listening on port: ${PORT}`);
    }
  });
});