import * as fs from 'fs';

export function createFolder(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

export function createOrAppend(path, message = '', opt = {}) {
    opt?.question && (message = '## ___' + message + '___');
    opt?.response && (message += '\n___\n<br />');
    message += '\n\n';

    if (!fs.existsSync(path)) {
        fs.writeFile(path, message, function (err) {
            if (err) throw err;
        });
    } else {
        fs.appendFile(path, message, (err) => {
            if (err) throw err;
        });
    }
}