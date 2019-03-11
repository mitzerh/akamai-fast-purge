
const EdgeGrid = require('edgegrid');
const config = require('./config');
const fs = require('fs');
const log = console.log;

const PRIVATE_DATA = Symbol('DATA_MODEL');

class App {

    constructor(props) {

        this[PRIVATE_DATA] = {
            ENABLED: false
        };

        let allow = true;
        let required = ['client_token', 'client_secret', 'access_token', 'host'];

        if (props) {
            for (let i = 0, len = required.length; i < len; i++) {
                if (!props[required[i]]) {
                    allow = false;
                    break;
                }
            }
            if (!allow) {
                log('[akamai fast purge] required OAUTH properties missing!');
            }
        }

        if (allow) {

            try {
                let host = props[required[3]];
                const EG = new EdgeGrid(
                    props[required[0]], // client_token
                    props[required[1]], // client_secret
                    props[required[2]], // access_token
                    `https://${host}` // host
                );
                this[PRIVATE_DATA].EG = EG;
                this[PRIVATE_DATA].props = props;
                this[PRIVATE_DATA].ENABLED = true;
            } catch(err) {
                log('[akamai fast purge] EdgeGrid initialize error:', err);
            }

        }

    }

    submit(objects, opts) {

        const self = this;
        const res = new Promise((resolve, reject) => {

            if (!this[PRIVATE_DATA].ENABLED) {
                return reject({
                    error: true,
                    msg: 'OAUTH credentials error!'
                });
            }

            objects = (Array.isArray(objects) && objects.length > 0) ? objects : null;
            opts = opts || {};

            let operation = ((val) => {
                let allowed = ['invalidate', 'delete'];
                let res = allowed[0]; // default
                if (val) {
                    // null if not allowed to let user know
                    res = (allowed.indexOf(val) > -1) ? val : null;
                }
                return res;
            })(opts.operation);

            let type = ((val) => {
                let allowed = ['url', 'cpcode', 'tag'];
                let res = allowed[0]; // default
                if (val) {
                    // null if not allowed to let user know
                    res = (allowed.indexOf(val) > -1) ? val : null;
                }
            })(opts.type);

            let network = (opts.network === 'staging') ? 'staging' : 'production';

            if (!type || !operation) {
                return reject({
                    error: true,
                    msg: 'requires a valid type or operation!'
                });
            }

            if (!objects) {
                return reject({
                    error: true,
                    msg: 'invalid content objects!'
                });
            }

            let path = ((val) => {
                // if staging network
                if (network === 'staging') {
                    val = `${val}/staging`;
                }
                return val;
            })(config.paths[operation][type]);

            // Object
            self[PRIVATE_DATA].EG.auth({
                path: path,
                method: "POST",
                body: {
                    objects: objects
                }
            }).send(function (error, response, body) {

                let statusCode = response.statusCode;

                try {
                    // success
                    resolve({
                        request: {
                            statusCode: statusCode,
                            network: network,
                            operation: operation
                        },
                        status: JSON.parse(body)
                    });
                } catch(err) {
                    reject({
                        error: true,
                        request: {
                            statusCode: statusCode,
                            network: network,
                            operation: operation
                        },
                        msg: err,
                        raw: body
                    });
                }

            });
        });

        return res;
    }

}

module.exports = {
    create: (props) => {
        return new App(props);
    }
};
