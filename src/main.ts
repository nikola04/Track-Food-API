import express from "express";
import { connect } from "@/config/database";
import { extractHeaders } from "@/middlewares/headers";
import cors from 'cors'
import routes from "@/routes/";
const app = express();

app.set('trust proxy', true);
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(extractHeaders({ device: true, authorization: true }));
app.use("/", routes);

connect().then(() => {
  app.listen(process.env.PORT, () =>
    console.log("✅", `Listening on http://localhost:${process.env.PORT}/`),
  );
});
