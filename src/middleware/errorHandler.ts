import { Request, Response, ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response) => {
	if (err instanceof Error) {
		console.error(err.stack);
		return res.status(500).send(err.message);
	}
	return null;
};
