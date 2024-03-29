// app.init.ts
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import router from "../routes/index";
import fileUpload from "express-fileupload"

const server = express();

async function appInit() {
  try {
    console.log("setting up...");
    // middleware
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(morgan("dev"));
    server.use(fileUpload({ useTempFiles: true }));

    // CORS configuration
    server.use((req, res, next) => {
      res.header(
        "Access-Control-Allow-Origin",
        process.env.CLIENT_ENDPOINT
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE, PATCH"
      );

      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    server.use('/', router);

    server.listen(process.env.PORT, () => {
      console.log(`http server listening at ${process.env.PORT}`)
    });

  } catch (error) {
    throw error;
  }
}

export { appInit };
