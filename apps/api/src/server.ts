import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(
    `🚀 NovelVerse API running on http://localhost:${env.port}`,
  );
});