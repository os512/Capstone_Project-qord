import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
	email: { type: String, required: true },
	name: { type: String },
	image: { type: String },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
