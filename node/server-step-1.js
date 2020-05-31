const express = require("express");
const spdy = require("spdy");
const httpServer = require('http');
const path = require("path");
const { readFile } = require("./fs-promises");
const logger = require("morgan");
const fs = require("fs");

const PATH_TO_BUILD_DIR = path.join(__dirname, "build");
const PATH_TO_HTML = path.join(PATH_TO_BUILD_DIR, "index.html");

const app = express();
const PORT = 8080;

app.use(logger("dev"));

app.use(express.static(PATH_TO_BUILD_DIR));

app.use('*', express.static(PATH_TO_HTML));

const server = httpServer.createServer(app);

server.listen(PORT);