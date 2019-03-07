
const Helper = require('cli-helper').instance;

const config = {};

config.paths = {
    invalidate: {
        url: '/ccu/v3/invalidate/url',
        cpcode: '/ccu/v3/invalidate/cpcode/',
        tag: '/ccu/v3/invalidate/tag/'
    }
};

module.exports = config;
