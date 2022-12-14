import { createParser } from "../src/parser";
import * as S from "../src/specs";

describe("parseUnsafe", () => {
  test("succeeds for string spec", () => {
    const settings = createParser({ connectionString: S.string });

    expect(settings.parseUnsafe({ connectionString: "hello" })).toStrictEqual({
      connectionString: "hello",
    });
  });

  test("fails when input field is missing", () => {
    const settings = createParser({ connectionString: S.string });

    expect(() => settings.parseUnsafe({})).toThrow(
      Error(
        `Failed validating field 'connectionString' with error 'missing-field'.`
      )
    );
  });
});
