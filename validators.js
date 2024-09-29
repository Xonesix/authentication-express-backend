export function validateName(name) {
  if (
    !name ||
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 50
  ) {
    throw new Error("Name must be between 2 and 50 characters long.");
  }
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
  if (!email || !emailRegex.test(email)) {
    throw new Error("Invalid email format.");
  }
}

export function validatePassword(password) {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    throw new Error(
      "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
    );
  }
}

export function validateAll(name, email, password) {
  validateName(name);
  validateEmail(email);
  validatePassword(password);
}
