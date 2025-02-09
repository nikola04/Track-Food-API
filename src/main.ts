import express from "express";
import { connect } from "./config/database";
import routes from "./routes/";
const app = express();

app.use("/", routes);

connect().then(() => {
  app.listen(process.env.PORT, () =>
    console.log("✅", `Listening on http://localhost:${process.env.PORT}/`),
  );
});
