import { config } from "dotenv";
config();
export default function (name) {
  return process.env[name];
}
