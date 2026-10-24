import { createApp } from "./http/server.js";
import { Store } from "./store.js";

const port = Number(process.env.PORT ?? 3000);

createApp(new Store()).listen(port, () => {
  console.log(`shelf listening on http://localhost:${port}`);
});
