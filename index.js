
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

        if (props) {
            let required = ['client_token', 'client_secret', 'access_token', 'host'];
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
                const EG = new EdgeGrid(
                    props.client_token,
                    props.client_secret,
                    props.access_token,
                    `https://${props.host}`
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

            let operation = (!opts.operation) ? 'invalidate' : (['invalidate', 'delete'].indexOf(opts.operation) > -1) ? opts.operation : null;
            let type = (!opts.type) ? 'url' : (['url', 'cpcode', 'tag'].indexOf(opts.type) > -1) ? opts.type : null;
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
