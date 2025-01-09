import { Router } from 'express';
import { readFile } from 'node:fs/promises'

const examRouter = Router();

examRouter.route('/paper').get(async (_req, res) => {
    console.log("Request at : /api/exams/paper");
    const paper = await readFile(new URL('../data/paper.json', import.meta.url), 'utf-8');
    res.send(paper);
});

export { examRouter };
