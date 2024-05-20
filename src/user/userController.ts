import { Response, Request, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
const createUser = async (req: Request, res: Response, next: NextFunction) => {
	//Validation
	//Processing
	//Response
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		const error = createHttpError(401, "Some Fields cannot be empty");
		return next(error);
	}

	const user = await userModel.findOne({ email: email });
	if (user) {
		const error = createHttpError(400, "User already exists.");
		return next(error);
	}
	res.json({
		message: "User Created",
	});
};
export { createUser };
