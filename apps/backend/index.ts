import baseApp from "./src/server";
import { BackendEnv as env } from "@shuffle:shared";

export default {
	port: env.PORT,
	fetch: baseApp.fetch,
};
