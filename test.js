
const App = require('./index');
const Helper = require('cli-helper').instance;
const yaml = require('js-yaml');
const log = console.log;

let testconf = './config/test.yaml';

if (!Helper.isPathExists(testconf)) {
    log('no test config..');
    process.exit();
}

const conf = yaml.safeLoad(Helper.readFile(testconf));
const ThePurge = new App(conf);

ThePurge.submit([
    'https://www.foxnews.com'
]).then((info) => {
    log('done >>>>\n', info);
}).catch((info) => {
    log('error >>>>\n', info);
});
