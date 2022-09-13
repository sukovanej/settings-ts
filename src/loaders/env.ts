import { Loader } from "../loader";

export const envLoader: Loader = {
  load: () => process.env,
};
