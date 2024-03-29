import "dotenv/config"

import { appInit } from "./src/init/app.init";
import { dbInit } from "./src/init/dbInit";

(async () => {
  try {
    console.log("starting");
    await dbInit();
    await appInit();
  } catch (error) {
    console.error(error);
  }
})();
