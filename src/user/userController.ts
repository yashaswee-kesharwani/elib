import { Response, Request, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";
const createUser = async (req: Request, res: Response, next: NextFunction) => {
	//Validation
	//Processing
	//Response
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		const error = createHttpError(401, "Some Fields cannot be empty");
		return next(error);
	}

	try {
		const user = await userModel.findOne({ email });
		if (user) {
			const error = createHttpError(400, "User already exists.");
			return next(error);
		}
	} catch (err) {
		return next(createHttpError(500, "Error while fetching user"));
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	let newUser: User;
	
	try {
		newUser = await userModel.create({
			name,
			email,
			password: hashedPassword,
		});
	} catch (err) {
		return next(createHttpError(500, "Error while creating user"));
	}

	try {
		const token = sign(
			{
				sub: newUser._id,
			},
			config.jwtSecret as string,
			{
				expiresIn: "7d",
				algorithm: "HS256",
			}
		);
		res.status(201).json({
			accessToken: token,
		});
	} catch(err){
		createHttpError(500,"Error while signing the jwt token");
	}
	};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	const {email, password} = req.body;
	if (!email || !password) {
		const error = createHttpError(401, "Some Fields cannot be empty");
		return next(error);
	}
	try {
		const user = await userModel.findOne({ email });
		if (user) {
			const isMatch = await bcrypt.compare(password,user.password);
			if(isMatch) {
				try {
					const token = sign(
						{
							sub: user._id,
						},
						config.jwtSecret as string,
						{
							expiresIn: "7d",
							algorithm: "HS256",
						}
					);
					res.status(201).json({
						accessToken: token,
					});
				} catch(err){
					createHttpError(500,"Error while signing the jwt token");
				}
			} else {
				const error = createHttpError(400, "Username or password incorrect");
				return next(error);
			}
		} else {
			const error = createHttpError(404, "User Not Found");
			return next(error);
		}
	} catch (err) {
		return next(createHttpError(500, "Error while fetching user"));
	}

}
export { createUser, loginUser };
