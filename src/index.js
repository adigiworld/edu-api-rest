import express, { json, urlencoded } from "express";

import { onlineExams, ssccglpaper } from "./routes/exams.mjs";

const api = express();
const PORT = 8080;

api.use(urlencoded({ extended: true }));
api.use(json())

// api.get('/', (_req, res) => {
//     res.json({ status: "OK" });
// });
api.route('/').get((_req, res) => {
    res.json({ status: "OK" });
});

api.route('/api/ssccglexam').get((_req, res) => {
    // console.log(ssccglpaper);
    res.json(ssccglpaper);
});

// onlineExams(api);
// console.log(ncertMath)

api.listen(PORT, () => { console.log(`Server is running at: http://localhost:${PORT}`) });

