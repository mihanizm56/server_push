const path = require("path");
const fs = require("fs");
const { readFile } = require("./fs-promises");
const { walker } = require("./walker");
const PATH_TO_BUILD_DIR = path.join(__dirname, "build");
const PATH_TO_HTML = path.join(PATH_TO_BUILD_DIR, "index.html");

module.exports.getAllFilesInfo = async () => {
  const htmlFileData = await readFile(PATH_TO_HTML, "utf-8");

  const files = [
    {
      fullPath: PATH_TO_HTML,
      staticPath: "/index.html",
      fileData: htmlFileData,
    },
  ];

  await walker(
    PATH_TO_BUILD_DIR,
    (filePath) =>
      new Promise(async (resolve) => {
        const fileBasename = path.basename(filePath);
        const fileDirname = path.dirname(filePath);
        const fileData = await readFile(filePath, "utf-8");

        filePath.replace(
          /(\/build)(\/\w+(\/*)(.*))/,
          (match, _, formattedStaticPath) => {
            files.push({
              fullPath: filePath,
              staticPath: formattedStaticPath,
              fileData,
            });
          }
        );

        resolve();
      }),

    () => Promise.resolve()
  );

  return files;
};