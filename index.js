const prettier = require("prettier");
const mime = require("mime-types");
const fs = require("fs");
const fileWalker = require("recursive-file-walker");
const tscl = require("time-stamped-console-log");

module.exports = (directory) => {
  fileWalker({
    entry: directory,
    onFile: (info) => {
      // only prettify files changed from the last time
      if (info.modified) {
        let parser;
        if (mime.lookup(info.path) === "text/html") {
          parser = "html";
        } else if (
          mime.lookup(info.path) === "text/css" ||
          mime.lookup(info.path) === "text/x-scss" ||
          mime.lookup(info.path) === "text/x-sass" ||
          mime.lookup(info.path) === "text/less"
        ) {
          parser = "css";
        } else if (
          mime.lookup(info.path) === "application/javascript" &&
          !/\.min\.js$/.test(info.path)
        ) {
          parser = "babel";
        } else if (mime.lookup(info.path) === "application/json") {
          parser = "json";
        }
        // only prettify for valid file types
        if (parser) {
          const contents = fs.readFileSync(info.path, "utf8");
          const checker = prettier.check(contents, { parser: parser });
          // only prettify when needed
          if (!checker) {
            fs.writeFileSync(
              info.path,
              prettier.format(contents, { parser: parser })
            );
            tscl("prettified: " + info.path, {
              message: {
                color: "magenta",
              },
            });
          }
        }
      }
    },
  });
};
