import * as E from "fp-ts/Either";
import {
  createMissingFieldParseError,
  createValidationError,
} from "../src/errors";
import { createParser } from "../src/parser";
import * as S from "../src/specs";

describe("createParser", () => {
  test("succeeds for empty settings struct", () => {
    const settings = createParser({});
    expect(settings.parse({})).toStrictEqual(E.of({}));
  });

  test("succeeds for string spec", () => {
    const settings = createParser({ connectionString: S.string });

    expect(settings.parse({ connectionString: "hello" })).toStrictEqual(
      E.of({ connectionString: "hello" })
    );
  });

  test("succeeds for nonEmptyString spec", () => {
    const settings = createParser({ connectionString: S.nonEmptyString });

    expect(settings.parse({ connectionString: "hello" })).toStrictEqual(
      E.of({ connectionString: "hello" })
    );
  });

  test("fails when input field is missing", () => {
    const settings = createParser({ connectionString: S.string });

    expect(settings.parse({})).toStrictEqual(
      E.left(createMissingFieldParseError("connectionString"))
    );
  });

  test("fails when input field has different type", () => {
    const settings = createParser({ connectionString: S.nonEmptyString });

    expect(settings.parse({ connectionString: "" })).toStrictEqual(
      E.left(
        createValidationError("connectionString", "Expected non-empty string.")
      )
    );
  });

  test("fails for not valid URL", () => {
    const settings = createParser({ url: S.url });

    expect(settings.parse({ url: "not-valid-url" })).toStrictEqual(
      E.left(
        createValidationError(
          "url",
          "Value 'not-valid-url' is not a valid URL."
        )
      )
    );
  });

  test("succeeds for URL spec", () => {
    const settings = createParser({ url: S.url });

    expect(settings.parse({ url: "http://domain.com/" })).toStrictEqual(
      E.of({ url: new URL("http://domain.com/") })
    );
  });
});
