import * as E from "fp-ts/Either";
import * as IOE from "fp-ts/IOEither";
import { pipe } from "fp-ts/lib/function";
import { Loader } from "../loader";
import { SettingsInput } from "../parser";
import { readFileSync } from "./utils";

type FileNotFoundError = {
  error: "FileNotFoundError";
  message: string;
};

type ParseError = {
  error: "ParseError";
  message: string;
};

const createParserError = (message: string): ParseError => ({
  error: "ParseError",
  message,
});

export type DotEnvFileLoaderError = FileNotFoundError | ParseError;

export const createDotEnvFileLoader = (
  fileName: string
): Loader<DotEnvFileLoaderError> => ({
  load: createLoader(fileName),
});

const createLoader = (
  fileName: string
): IOE.IOEither<DotEnvFileLoaderError, SettingsInput> =>
  pipe(readFileSync(fileName), IOE.chainEitherKW(parseDotEnvFile));

const parseDotEnvFile = (
  content: string
): E.Either<ParseError, SettingsInput> => {
  const lines = content.split("\n");
  const result: SettingsInput = {};

  for (const [index, line] of lines.entries()) {
    const parsedLine = parseLine(index, line, result);

    if (E.isLeft(parsedLine)) {
      return parsedLine;
    }

    const [fieldKey, fieldValue] = parsedLine.right;
    result[fieldKey] = fieldValue;
  }

  return E.of(result);
};

const parseLine = (
  index: number,
  line: string,
  result: SettingsInput
): E.Either<ParseError, [string, string]> => {
  const values = line.split("=");

  if (values.length !== 2) {
    return E.left(createParserError(`Unexpected '=' on line ${index}.`));
  }

  const [fieldKey, fieldValue] = values;

  if (/^[a-zA-Z_]+[a-zA-Z0-9_]*$/.test(fieldKey)) {
    return E.left(
      createParserError(`Unexpected field name '${fieldKey}' on line ${index}.`)
    );
  }

  if (fieldKey in result) {
    return E.left(
      createParserError(`Duplicated field '${fieldKey}' on line ${index}.`)
    );
  }

  return E.of([fieldKey, fieldValue]);
};
