# Akamai Fast Purge Utility

Node Plugin for Akamai Fast Purge

## Usage

```js
const FastPurge = require('akamai-fast-purge');
const Purge = new FastPurge([ OAUTH_PROPERTIES ]);

Purge.submit([ PURGE_OBJECTS ], [ PURGE_OPTIONS ])
    .then([ COMPLETE_HANDLER ])
    .catch([ ERROR_HANDLER ]);
```

### PURGE_OBJECTS

(Array) Purge objects are the dataset of what `url`, `cpcode`, or `tag` to invalidate or delete.

### OAUTH_PROPERTIES

For these values, please see **[Akamai documentation](https://developer.akamai.com/api/getting-started#addcredentialtoedgercfile)**.

| Property | Description |
|:---------|:------------|
| **`client_token`** | `client_token` in Akamai documentation |
| **`client_secret`** | `client_secret` in Akamai documentation |
| **`access_token`** | `access_token` in Akamai documentation |
| **`host`** | `host` in Akamai documentation |


### PURGE_OPTIONS

| Property | Values | Description |
|:---------|:-------|:------------|
| **`operation`** | `invalidate`/`delete` | (optional) [ **default: `invalidate`** ]  |
| **`type`** | `url`/`cpcode`/`tag` | (optional) [ **default: `url`** ] |
| **`network`** | `staging`/`production` | (optional) [ **default: `production`** ] |

### Examples

Invalidate URLS:

```js
Purge.submit([
    'https://www.your-website.com',
    'https://www.your-other-website.com/img/image.png'
]).then((data) => {
    console.log('purge complete!', data);
}).catch((err) => {
    console.log('something went wrong!', err);
});
```

Delete CPCODE:

```js
Purge.submit([
    'S/L/4900/218742/1m30s/your-website-cpcode.html'
], {
    operation: 'delete',
    type: 'cpcode'
}).then((data) => {
    console.log('purge complete!', data);
}).catch((err) => {
    console.log('something went wrong!', err);
});
```
