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

  test("positiveInteger: success", () => {
    const settings = createSettings({ port: S.positiveInteger });

    expect(settings.parse({ port: "12" })).toStrictEqual(E.of({ port: 12 }));
    expect(settings.parse({ port: "23123" })).toStrictEqual(
      E.of({ port: 23123 })
    );
  });

  test("positiveInteger: fail", () => {
    const settings = createSettings({ port: S.positiveInteger });

    expect(settings.parse({ port: "http://localhost" })).toStrictEqual(
      E.left(createValidationError("port", "Expected number."))
    );

    expect(settings.parse({ port: "2.34" })).toStrictEqual(
      E.left(createValidationError("port", "Expected integer."))
    );

    expect(settings.parse({ port: "-3.1415" })).toStrictEqual(
      E.left(createValidationError("port", "Expected integer."))
    );

    expect(settings.parse({ port: "0" })).toStrictEqual(
      E.left(createValidationError("port", "Expected positive integer."))
    );

    expect(settings.parse({ port: "-120" })).toStrictEqual(
      E.left(createValidationError("port", "Expected positive integer."))
    );

    expect(settings.parse({ port: "-0" })).toStrictEqual(
      E.left(createValidationError("port", "Expected positive integer."))
    );
  });

  test("integerRange: success", () => {
    const settings = createSettings({ port: S.integerRange(0, 256) });

    expect(settings.parse({ port: "0" })).toStrictEqual(E.of({ port: 0 }));
    expect(settings.parse({ port: "10" })).toStrictEqual(E.of({ port: 10 }));
    expect(settings.parse({ port: "256" })).toStrictEqual(E.of({ port: 256 }));
  });

  test("integerRange: fail", () => {
    const settings = createSettings({ port: S.integerRange(0, 256) });

    expect(settings.parse({ port: "257" })).toStrictEqual(
      E.left(createValidationError("port", "Expected integer in range 0-256."))
    );

    expect(settings.parse({ port: "-1" })).toStrictEqual(
      E.left(createValidationError("port", "Expected integer in range 0-256."))
    );
  });

  test("port: success", () => {
    const settings = createSettings({ port: S.port });

    expect(settings.parse({ port: "0" })).toStrictEqual(E.of({ port: 0 }));
    expect(settings.parse({ port: "10" })).toStrictEqual(E.of({ port: 10 }));
    expect(settings.parse({ port: "5453" })).toStrictEqual(
      E.of({ port: 5453 })
    );
  });

  test("port: fail", () => {
    const settings = createSettings({ port: S.port });

    expect(settings.parse({ port: "65537" })).toStrictEqual(
      E.left(
        createValidationError("port", "Expected integer in range 0-65536.")
      )
    );

    expect(settings.parse({ port: "-1" })).toStrictEqual(
      E.left(
        createValidationError("port", "Expected integer in range 0-65536.")
      )
    );
  });
});
