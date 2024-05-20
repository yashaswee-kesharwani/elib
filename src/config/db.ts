import mongoose from "mongoose";
import { config } from "./config";
const connectDB = async () => {
	try {
		mongoose.connection.on("connected", () => {
			console.log("Connected to DB successfully.");
		});
		mongoose.connection.on("error", (err) => {
			console.log("Connection to DB Failed", err);
		});
		await mongoose.connect(config.databaseURL as string);
	} catch (err) {
		console.log("Failed to Connect to DB.", err);
		process.exit(1);
	}
};
export default connectDB;
