
const EdgeGrid = require('edgegrid');
const config = require('./config');

class App {

    constructor(props) {
        this.props = props;

        this.EG = new EdgeGrid(
            props.client_token,
            props.client_secret,
            props.access_token,
            `https://${props.host}`
        );
    }

    submit(objects, opts) {
        objects = (Array.isArray(objects) && objects.length > 0) ? objects : null;
        opts = opts || {};

        let operation = (!opts.operation) ? 'invalidate' : (['invalidate', 'delete'].indexOf(opts.operation) > -1) ? opts.operation : null;
        let type = (!opts.type) ? 'url' : (['url', 'cpcode', 'tag'].indexOf(opts.type) > -1) ? opts.type : null;

        const res = new Promise((resolve, reject) => {

            if (!type || !operation) {
                return reject({
                    error: true,
                    msg: 'requires a valid type and operation!'
                });
            }

            if (!objects) {
                return reject({
                    error: true,
                    msg: 'invalide objects!'
                });
            }

            let path = ((val) => {
                // if staging network
                if (opts.network === 'staging') {
                    val = `${val}/staging`;
                }
                return val;
            })(config.paths[operation][type]);

            // Object
            this.EG.auth({
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
                        statusCode: statusCode,
                        content: JSON.parse(body)
                    });
                } catch(err) {
                    reject({
                        error: true,
                        statusCode: statusCode,
                        msg: err,
                        raw: body
                    });
                }

            });
        });

        return res;
    }

}

module.exports = App;
