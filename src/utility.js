import * as fs from 'fs';

export function createFolder(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

export async function createOrAppend(path, message = '', opt = {}) {
    opt?.question && (message = '## ___' + message + '___');
    opt?.response && (message += '\n___\n<br />');
    message += '\n\n';

    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, message, function (err) {
            if (err) throw err;
        });
    } else {
        fs.appendFileSync(path, message, (err) => {
            if (err) throw err;
        });
    }
}