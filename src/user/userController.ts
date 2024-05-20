import { Response, Request, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
const createUser = async (req: Request, res: Response, next: NextFunction) => {
	//Validation
	//Processing
	//Response
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		const error = createHttpError(401, "Some Fields cannot be empty");
		return next(error);
	}

	const user = await userModel.findOne({ email });
	if (user) {
		const error = createHttpError(400, "User already exists.");
		return next(error);
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = await userModel.create({
		name,
		email,
		password: hashedPassword,
	});
	const token = sign(
		{
			sub: newUser._id,
		},
		config.jwtSecret as string,
		{
			expiresIn: "7d",
		}
	);
	res.json({
		accessToken: token,
	});
};
export { createUser };
