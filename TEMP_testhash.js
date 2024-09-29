import crypto from "node:crypto";

// Function to hash and salt a password using promises
export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    // Generate a salt
    const salt = crypto.randomBytes(16).toString("hex");

    // Hash the password with the salt
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      if (err) {
        return reject(err);
      }

      // Store the salt and hash together
      const hash = derivedKey.toString("hex");
      console.log(`Salt: ${salt}`);
      console.log(`Hash: ${hash}`);

      // Resolve the promise with salt and hash
      resolve({ salt, hash });
    });
  });
}

export function verifyPassword(storedHash, storedSalt, inputPassword) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      inputPassword,
      storedSalt,
      100000,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) {
          return reject(err);
        }

        const hash = derivedKey.toString("hex");
        // Compare the generated hash with the stored hash
        resolve(hash === storedHash);
      }
    );
  });
}

export async function verifying() {
  const { salt, hash } = await hashPassword("test");
  (await verifyPassword(hash, salt, "dfsfdsfsf"))
    ? console.log("VALID!")
    : console.log("INVALID");
}
