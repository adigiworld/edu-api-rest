import { readFile } from 'node:fs/promises';

const pkg = await readFile(new URL('../../package.json', import.meta.url), 'utf8');
const { name, version } = JSON.parse(pkg);

const logger = (name, version, req) => {
    console.warn(`[${new Date().toLocaleString()}] : ${name}: ${version}, ${req.method()}:${req.path}`);
}
console.warn(`[${new Date().toLocaleString()}] : ${name}: ${version}`);

export const config = {
    development: {
        name, version, log: () => { logger(name, version, req) }
    },
    production: {
        name, version, log: () => { logger(name, version, req) }
    }
}


// console.info(name, version);
// console.debug(name, version);
// console.timeLog(`${name}, ${version}`, new Date.toString());
// console.table([name, version]);
// console.timeLog('amr', [name, version]);
// console.timeStamp(`${name}, ${version} `);
// console.timeLog('arm', [name, version]);
// console.trace(name, version);
// console.trace(name, version);

