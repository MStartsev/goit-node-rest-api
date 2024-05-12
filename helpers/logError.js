// Function to write an error to the error.log file
import { readFile, writeFile } from "fs/promises";
import path from "path";

const ERROR_LOG_FILE = path.join("error.log");
const MAX_LOG_ERRORS = 10;

async function logError(error) {
  const divide = "\n___\n";
  const errorMessage = `${new Date().toISOString()} - ${error.stack}\n`;

  try {
    const data = await readFile(ERROR_LOG_FILE, "utf8");
    const errors = data.trim().split(divide);
    if (errors.length >= MAX_LOG_ERRORS) {
      errors.shift();
    }

    errors.push(errorMessage);

    await writeFile(ERROR_LOG_FILE, errors.join(divide), "utf8");
  } catch (err) {
    console.error("Error logging error:", err);
  }
}

export default logError;
