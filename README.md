# Akamai Fast Purge Utility

Node Plugin for using Akamai Fast Purge via [EdgeGrid](https://www.npmjs.com/package/edgegrid)

## Usage

```js
const FastPurge = require('fast-purge');

const Purge = FastPurge.create({
    client_token: 'xxxxx',
    client_secret: 'xxxxx',
    access_token: 'xxxxx',
    host: 'xxxxx'
});
```

### OAUTH PROPERTIES

For these values, please see **[Akamai documentation](https://developer.akamai.com/api/getting-started#addcredentialtoedgercfile)**.

| Property | Description |
|:---------|:------------|
| **`client_token`** | `client_token` in Akamai documentation |
| **`client_secret`** | `client_secret` in Akamai documentation |
| **`access_token`** | `access_token` in Akamai documentation |
| **`host`** | `host` in Akamai documentation |

## Methods

### `.submit()`

Submit a cache purge to Akamai.

```js
Purge.submit([ PURGE_OBJECTS ], [ PURGE_OPTIONS ])
    .then([ COMPLETE_HANDLER ])
    .catch([ ERROR_HANDLER ]);
```

#### PURGE_OBJECTS

(**`Array`**) Collection of content objects -- `url`, `cpcode`, or `tag` -- to **invalidate** or **delete**.

#### PURGE_OPTIONS

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
