import express, { json, urlencoded } from "express";

import { authRouter, authUserRouter, examRouter } from "./routes/index.js";
// import { protect } from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(urlencoded({ extended: true }));
app.use(json());

app.route("/").get((_req, res) => {
    res.json({ status: "OK" });
});

// app.use("/", router);
//
app.use("/api/auth", authRouter);
app.use("/api/authusers", authUserRouter);
// app.use("/api/exams", protect, apiRouter);
app.use("/api/exams", examRouter);

export { app, PORT };
