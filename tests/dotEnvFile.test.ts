import { fail } from "assert";
import * as IOE from "fp-ts/IOEither";
import { pipe } from "fp-ts/lib/function";
import path from "path";
import { createDotEnvFileSettings } from "../src/settings";
import * as S from "../src/specs";

describe("dotenv file loader", () => {
  test("example: dotenv file", () => {
    const mockFilePath = path.join(__dirname, "mocks/example.env");
    const settings = createDotEnvFileSettings(mockFilePath, {
      URL: S.url,
      PI: S.number,
    });

    pipe(
      settings.load,
      IOE.map((result) =>
        expect(result).toStrictEqual({
          URL: new URL("http://url.com"),
          PI: 3.14,
        })
      ),
      IOE.mapLeft((error) => fail(JSON.stringify(error)))
    )();

    expect.assertions(1);
  });

  test("example: wrong dotenv file", () => {
    const mockFilePath = path.join(__dirname, "mocks/wrong_example.env");
    const settings = createDotEnvFileSettings(mockFilePath, {});

    pipe(
      settings.load,
      IOE.mapLeft((error) =>
        expect(error).toStrictEqual({
          error: "ParseError",
          message: "Unexpected '=' on line 1.",
        })
      )
    )();

    expect.assertions(1);
  });

  test("example: non-existing dotenv file", () => {
    const mockFilePath = "not-existing/path-to-file.env";
    const settings = createDotEnvFileSettings(mockFilePath, {});

    pipe(
      settings.load,
      IOE.mapLeft((error) =>
        expect(error).toStrictEqual({
          error: "FileNotFoundError",
          path: "not-existing/path-to-file.env",
        })
      )
    )();

    expect.assertions(1);
  });

  test("example: wrong field name in .env file", () => {
    const mockFilePath = path.join(__dirname, "mocks/wrong_example2.env");
    const settings = createDotEnvFileSettings(mockFilePath, {});

    pipe(
      settings.load,
      IOE.mapLeft((error) =>
        expect(error).toStrictEqual({
          error: "ParseError",
          message: "Unexpected field name '2WRONG-NAME' on line 1.",
        })
      )
    )();

    expect.assertions(1);
  });

  test("example: duplicated keys in .env file", () => {
    const mockFilePath = path.join(__dirname, "mocks/duplicated_fields.env");
    const settings = createDotEnvFileSettings(mockFilePath, {});

    pipe(
      settings.load,
      IOE.mapLeft((error) =>
        expect(error).toStrictEqual({
          error: "ParseError",
          message: "Duplicated field 'FIELD' on line 2.",
        })
      )
    )();

    expect.assertions(1);
  });
});
