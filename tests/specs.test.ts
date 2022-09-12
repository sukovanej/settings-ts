import * as E from "fp-ts/Either";
import { createSettings } from "../src";
import { createValidationError } from "../src/errors";
import * as S from "../src/specs";

describe("specs", () => {
  test("number: success", () => {
    const settings = createSettings({ port: S.number });
    expect(settings.parse({ port: "-12" })).toStrictEqual(E.of({ port: -12 }));
    expect(settings.parse({ port: "2.34" })).toStrictEqual(
      E.of({ port: 2.34 })
    );
  });

  test("number: fail", () => {
    const settings = createSettings({ port: S.number });
    expect(settings.parse({ port: "http://localhost" })).toStrictEqual(
      E.left(createValidationError("port", "Expected number."))
    );
  });

  test("integer: success", () => {
    const settings = createSettings({ port: S.integer });

    expect(settings.parse({ port: "12" })).toStrictEqual(E.of({ port: 12 }));
    expect(settings.parse({ port: "-23" })).toStrictEqual(E.of({ port: -23 }));
  });

  test("integer: fail", () => {
    const settings = createSettings({ port: S.integer });

    expect(settings.parse({ port: "http://localhost" })).toStrictEqual(
      E.left(createValidationError("port", "Expected number."))
    );

    expect(settings.parse({ port: "2.34" })).toStrictEqual(
      E.left(createValidationError("port", "Expected integer."))
    );
  });
});