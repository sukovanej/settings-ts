import * as E from "fp-ts/Either";
import { createSettings } from "../../src";
import * as S from "../../src/specs";

describe("postgres spec", () => {
  const settings = createSettings({ db: S.postgresURI });

  const assertValidPostgresURI = (db: string, s: Record<string, unknown>) => {
    expect(settings.parse({ db })).toStrictEqual(E.of({ db: s }));
  };

  const assertInvalidPostgresURI = (db: string) => {
    expect(E.isLeft(settings.parse({ db }))).toBeTruthy();
  };

  test("(1) works for valid postgres URIs", () => {
    assertValidPostgresURI("postgres://localhost", {
      user: null,
      password: null,
      host: "localhost",
      port: null,
      database: null,
    });
  });

  test("(2) works for valid postgres URIs", () => {
    assertValidPostgresURI("postgres://localhost:5432", {
      user: null,
      password: null,
      host: "localhost",
      port: 5432,
      database: null,
    });
  });

  test("(3) works for valid postgres URIs", () => {
    assertValidPostgresURI("postgres://localhost:5432/db_name", {
      user: null,
      password: null,
      host: "localhost",
      port: 5432,
      database: "db_name",
    });
  });

  test("(4) works for valid postgres URIs", () => {
    assertValidPostgresURI("postgres://user:pass@localhost:5432/db_name", {
      user: "user",
      password: "pass",
      host: "localhost",
      port: 5432,
      database: "db_name",
    });
  });

  test("(5) works for valid postgres URIs", () => {
    assertValidPostgresURI("postgres://user@localhost:5432/db_name", {
      user: "user",
      password: null,
      host: "localhost",
      port: 5432,
      database: "db_name",
    });
  });

  test("(1) fails for invalid postgres URIs", () => {
    assertInvalidPostgresURI("postgres://user@localhost:invalid-port/db_name");
    assertInvalidPostgresURI("mysql://localhost");
    assertInvalidPostgresURI("postgres://localhost@localhost@milan");
  });
});
