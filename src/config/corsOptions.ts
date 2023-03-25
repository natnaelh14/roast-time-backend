import { allowedOrigins } from "./allowedOrigins";

type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];

export const corsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, origin?: StaticOrigin) => void) => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
	optionsSuccessStatus: 200,
};
