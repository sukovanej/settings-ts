import * as E from "fp-ts/Either";
import { createSettings } from "../src";
import { createValidationError } from "../src/errors";
import * as S from "../src/specs";

describe("specs", () => {
  test("number: success", () => {
    const settings = createSettings({ port: S.number });
    expect(settings.parse({ port: "-12" })).toStrictEqual(E.of({ port: -12 }));
  });

  test("number: fail", () => {
    const settings = createSettings({ port: S.number });
    expect(settings.parse({ port: "http://localhost" })).toStrictEqual(
      E.left(createValidationError("port", "Expected number."))
    );
  });
});
