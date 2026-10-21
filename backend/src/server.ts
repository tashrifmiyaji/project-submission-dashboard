
import app from "./app.js";
import { env } from "./config/env.js";
import { seedAdmin } from "./script/seed.js";

const main = async () => {
  // seeding admin
  seedAdmin()

  const server = app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });

  server.on("error", (error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}
main()

