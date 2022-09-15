import * as IOE from "fp-ts/IOEither";
import * as E from "fp-ts/Either";
import fs from "fs";

export type FileNotFoundError = {
  error: "FileNotFoundError";
  message: string;
};

const createFileNotFoundError = (message: string): FileNotFoundError => ({
  error: "FileNotFoundError",
  message,
});

export const readFileSync =
  (fileName: string): IOE.IOEither<FileNotFoundError, string> =>
  () => {
    try {
      const result = fs.readFileSync(fileName, { encoding: "utf8" });
      return E.of(result);
    } catch (e) {
      return E.left(createFileNotFoundError(e as string));
    }
  };
