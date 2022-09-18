import * as IOE from "fp-ts/IOEither";
import { pipe } from "fp-ts/lib/function";
import mockedEnv from "mocked-env";
import { createEnvSettings } from "../src/settings";
import * as S from "../src/specs";

describe("settings", () => {
  test("example: settings from env", () => {
    // TODO: this test is probably not paralelizable and needs to run in sequence

    const restore = mockedEnv({
      API_URL: "http://server.com",
      USERNAME: "milan",
      PASSWORD: "lesnek",
      SERVER_PORT: "8080",
    });

    const settings = createEnvSettings({
      API_URL: S.url,
      USERNAME: S.string,
      PASSWORD: S.string,
      SERVER_PORT: S.port,
    });

    pipe(
      settings.load,
      IOE.map((result) =>
        expect(result).toStrictEqual({
          API_URL: new URL("http://server.com/"),
          USERNAME: "milan",
          PASSWORD: "lesnek",
          SERVER_PORT: 8080,
        })
      )
    )();

    restore();
    expect.assertions(1);
  });
});
