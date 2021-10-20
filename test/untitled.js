import prettier from "prettier";
import { lookup } from "mime-types";
import { readFile, writeFile } from "fs/promises";
import fileWalker from "recursive-file-walker";
import tscl from "time-stamped-console-log";
const {check, format} = prettier;
export default async directory => {
  const files = await fileWalker({
    id: "prettify-source",
    entry: directory,
    flatten: true,
    readFiles: "modified"
  });
  files.forEach(async file => {
    // only prettify files changed from the last time
    if (file.modified) {
      let parser;
      if (lookup(file.path) === "text/html") {
        parser = "html";
      } else if (
        lookup(file.path) === "text/css" ||
        lookup(file.path) === "text/x-scss" ||
        lookup(file.path) === "text/x-sass" ||
        lookup(file.path) === "text/less"
      ) {
        parser = "css";
      } else if (
        lookup(file.path) === "application/javascript" &&
        !/\.min\.js$/.test(file.path)
      ) {
        parser = "babel";
      } else if (lookup(file.path) === "application/json") {
        parser = "json";
      }
      // only prettify for valid file types
      if (parser) {
        const contents = await readFile(file.path, "utf8");
        const checker = check(contents, { parser: parser });
        // only prettify when needed
        if (!checker) {
          await writeFile(
            file.path,
            format(contents, { parser: parser })
          );
          tscl("prettified: " + file.path, {
            message: {
              color: "magenta",
            },
          });
        }
      }
    }
  })
};
