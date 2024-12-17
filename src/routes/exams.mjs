import { readFile } from 'node:fs/promises'

const onlineExams = (api) => {
    api.route('api/ssccglexam').get((_req, res) => {
        const paper = readFile(new URL('../data/ssccglpaper.json', import.meta.url), 'utf-8');
        console.log(paper);
        res.json(paper);
    });

    api.route('api/amuplustwo').get((_req, res) => {
        res.json({ status: 'OK' });
    });
}
const ssccglpaper = await readFile(new URL('../data/ssccglpaper.json', import.meta.url), 'utf-8')
    .then(data => JSON.parse(data))
    .catch(err => { throw err });

// export default onlineExams;
export { onlineExams, ssccglpaper };
