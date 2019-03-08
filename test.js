const Helper = require('cli-helper').instance;
const yaml = require('js-yaml');
const log = console.log;

let testConf = `${__dirname}/config/test.yaml`;
if (!Helper.isFileExists(testConf)) { process.exit(); }

const App = require('./index');
const conf = yaml.safeLoad(Helper.readFile(testConf));
const ThePurge = App.create(conf);

log('#1 running..');
ThePurge.submit([
    'https://www.foxnews.com'
]).then((info) => {
    log('#1 done >>>>\n', info);
}).catch((info) => {
    log('#1 error >>>>\n', info);
});

log('#2 running..');
ThePurge.submit([
    'htps://www.foxnews.com'
], {
    operation: 'foobar'
}).then((info) => {
    log('#2 done >>>>\n', info);
}).catch((info) => {
    log('#2 error >>>>\n', info);
});
