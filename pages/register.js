// import { NextApiRequest, NextApiResponse } from "next";
// import { createUser } from "@lib/db/models/User.js";

// export default async function handler(req, res) {
// 	const { email, name, image, ...rest } = req.body; // Destructure relevant user data

// 	try {
// 		const user = await createUser({ email, name, image, ...rest }); // Call your user creation logic
// 		res.status(200).json({ message: "User created successfully!", user });
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ error: "Error creating user" });
// 	}
// }
