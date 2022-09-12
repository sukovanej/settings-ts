import * as E from "fp-ts/Either";
import {
  createMissingFieldParseError,
  createValidationError,
} from "../src/errors";
import { createSettings } from "../src/settings";
import * as S from "../src/specs";

describe("createSettings", () => {
  test("succeeds for empty settings struct", () => {
    const settings = createSettings({});
    expect(settings.parse({})).toStrictEqual(E.of({}));
  });

  test("succeeds for string spec", () => {
    const settings = createSettings({ connectionString: S.string });

    expect(settings.parse({ connectionString: "hello" })).toStrictEqual(
      E.of({ connectionString: "hello" })
    );
  });

  test("succeeds for nonEmptyString spec", () => {
    const settings = createSettings({ connectionString: S.nonEmptyString });

    expect(settings.parse({ connectionString: "hello" })).toStrictEqual(
      E.of({ connectionString: "hello" })
    );
  });

  test("fails when input field is missing", () => {
    const settings = createSettings({ connectionString: S.string });

    expect(settings.parse({})).toStrictEqual(
      E.left(createMissingFieldParseError("connectionString"))
    );
  });

  test("fails when input field has different type", () => {
    const settings = createSettings({ connectionString: S.nonEmptyString });

    expect(settings.parse({ connectionString: "" })).toStrictEqual(
      E.left(
        createValidationError(
          "connectionString",
          S.EMPTY_STRING_ERROR_DESCRIPTION
        )
      )
    );
  });

  test("fails for not valid URL", () => {
    const settings = createSettings({ url: S.url });

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
    const settings = createSettings({ url: S.url });

    expect(settings.parse({ url: "http://domain.com/" })).toStrictEqual(
      E.of({ url: new URL("http://domain.com/") })
    );
  });
});
