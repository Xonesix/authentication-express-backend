import mongoose from "mongoose";
import { Schema } from "mongoose";
import userModel from "./User.js";
import crypto from "crypto";
import { hashPassword, verifyPassword } from "./TEMP_testhash.js";
import { validateEmail, validateName, validatePassword } from "./validators.js";

try {
  mongoose.connect("mongodb://localhost:3000/project");
} catch (error) {
  console.log(error);
}
mongoose.connection.on("connected", () => console.log("connected"));

// Let's do schema
// async function run() {
//   try {
//     const user = await userModel.create({ name: "Kevin Durant", age: "FGsdf" });
//     console.log(user);
//   } catch (error) {
//     console.error(error.message);
//   }
// }

// Params should be
/*
paramsSchema
{
    name: String
    email: String
    password: String
}
*/

export async function register(params) {
  // Input validation
  if (!params.name || !params.email || !params.password) {
    throw new Error("All fields are required.");
  }

  validateName(params.name);
  validateEmail(params.email);
  validatePassword(params.password);

  // Hash the password
  const { salt, hash } = await hashPassword(params.password);

  try {
    // Create the user
    const user = await userModel.create({
      name: params.name,
      email: params.email,
      hashedPassword: hash,
      salt: salt,
    });
    //console.log(user);
    return user; // Optionally return the created user
  } catch (error) {
    // console.error(`Error code ${error.code}`);
    if (error.code === 11000) throw new Error("User already exists");
    //console.error(error.message);
    else throw new Error("User registration failed.");
  }
}

export async function welcome(userId) {
  const user = await userModel.findById(userId);
  return user.email;
}

// const loginParams = {
//   email: "testemaiklae@Qtgsdg",
//   password: "testpassword",
// };
export async function login(params) {
  validateEmail(params.email);
  const user = await userModel.findOne({ email: params.email });
  if (user == null) {
    throw new Error("Username or password is invalid");
  } else {
    const boolThing = await verifyPassword(
      user.hashedPassword,
      user.salt,
      params.password
    );
    if (boolThing) {
      return user._id;
      // Send cookie or something
    } else {
      throw new Error("Username or password is invalid");
    }
  }
}
