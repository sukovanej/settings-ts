import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { SettingsSpec } from "../parser";
import { errorResult, successResult, ValidateResult } from "../validateResult";
import { createSpec } from "./basic";

type PostgresCredentials = {
  user: string | null;
  password: string | null;
};
type PostgresDNS = {
  host: string;
  port: number | null;
};
type PostgresDestination = PostgresDNS & { database: string | null };
type PostgresURI = PostgresCredentials & PostgresDestination;

const parseDNS = (s: string): ValidateResult<PostgresDNS> => {
  const byColonParts = s.split(":");
  let port = null;
  const host = byColonParts[0];

  if (byColonParts.length === 2) {
    port = parseInt(byColonParts[1], 10);

    if (isNaN(port)) {
      return errorResult("Port is not a valid number");
    }
  }

  return successResult({ host, port });
};

const parsePostgresDestination = (
  s: string
): ValidateResult<PostgresDestination> => {
  const bySlashParts = s.split("/");
  let database = null;
  const dns = parseDNS(bySlashParts[0]);

  if (E.isLeft(dns)) {
    return dns;
  }

  if (bySlashParts.length === 2) {
    database = bySlashParts[1];
  }

  return successResult({ ...dns.right, database });
};

const parsePostgresCredentials = (
  s: string
): ValidateResult<PostgresCredentials> => {
  const byColonParts = s.split(":");
  let password = null;
  const user = byColonParts[0];

  if (byColonParts.length === 2) {
    password = byColonParts[1];
  }

  return successResult({ user, password });
};

export const postgresURI: SettingsSpec<PostgresURI> = createSpec((s) => {
  const BEGINNING = "postgres://";

  if (!s.startsWith(BEGINNING)) {
    return errorResult(`Postgres URI must start with '${BEGINNING}'`);
  }

  const byAtParts = s.slice(BEGINNING.length).split("@");

  if (byAtParts.length === 2) {
    const credentials = parsePostgresCredentials(byAtParts[0]);
    const destination = parsePostgresDestination(byAtParts[1]);

    return pipe(
      E.of(
        (credentials: PostgresCredentials) =>
          (destination: PostgresDestination) => ({
            ...credentials,
            ...destination,
          })
      ),
      E.ap(credentials),
      E.ap(destination)
    );
  } else if (byAtParts.length === 1) {
    return pipe(
      parsePostgresDestination(byAtParts[0]),
      E.map((destination) => ({ ...destination, user: null, password: null }))
    );
  }

  return errorResult("Expected postgres URI.");
});
