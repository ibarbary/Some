import { randomBytes } from "crypto";

function generateUsername(name: string, email: string): string {
  let base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12);

  const suffix = randomBytes(2).toString("hex");

  return `${base}_${suffix}`;
}

export default generateUsername;
