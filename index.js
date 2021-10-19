import prettier from "prettier";
import { lookup } from "mime-types";
import { readFile, writeFile } from "fs/promises";
import fileWalker from "recursive-file-walker";
import tscl from "time-stamped-console-log";
const {check, format} = prettier;
export default async directory => {
  await fileWalker({
    entry: directory,
    onFile: async info => {
      // only prettify files changed from the last time
      if (info.modified) {
        let parser;
        if (lookup(info.path) === "text/html") {
          parser = "html";
        } else if (
          lookup(info.path) === "text/css" ||
          lookup(info.path) === "text/x-scss" ||
          lookup(info.path) === "text/x-sass" ||
          lookup(info.path) === "text/less"
        ) {
          parser = "css";
        } else if (
          lookup(info.path) === "application/javascript" &&
          !/\.min\.js$/.test(info.path)
        ) {
          parser = "babel";
        } else if (lookup(info.path) === "application/json") {
          parser = "json";
        }
        // only prettify for valid file types
        if (parser) {
          const contents = await readFile(info.path, "utf8");
          const checker = check(contents, { parser: parser });
          // only prettify when needed
          if (!checker) {
            await writeFile(
              info.path,
              format(contents, { parser: parser })
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
