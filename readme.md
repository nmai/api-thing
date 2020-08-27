
## API

### POST `/register/:username/:password`
_Returns: `application/json`_
```ts
// UserRef
{
  id: string,
  username: string,
}
```
_Example:_
POST `/register/user100/password100`
```json
{
  "id": "d7b38ff2-49cd-466a-83d3-0577fc92e832",
  "username": "user100"
}
```
----
## Authenticated endpoints:
You must include the JWT token you acquired from `/login` to access any of the following endpoints, with `"Bearer "` prepended.
An example request header:
```
authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg2NmUxNTFiLTFhMmUtNDIxMy1iNjYxLTQxNzZkOGQyODUwMSIsInVzZXJuYW1lIjoidXNlcjIiLCJpYXQiOjE1OTg0OTM4NjEsImV4cCI6MTU5ODU4MDI2MX0.T475gLdaqaztNiFE2lCIyEMK1BuWIniBGVeYPDxDYIc
```


### POST `/login/:username/:password`
_Returns: `application/json`_
```ts
{
  // UserRef
  user: {
    id: string,
    username: string,
  },
  // JWT, to be used in bearer token
  token: string,
}
```
_Example:_
POST `/login/user100/password100`
```json
{
  "user": {
    "id": "d7b38ff2-49cd-466a-83d3-0577fc92e832",
    "username": "user100"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ3YjM4ZmYyLTQ5Y2QtNDY2YS04M2QzLTA1NzdmYzkyZTgzMiIsInVzZXJuYW1lIjoidXNlcjEwMCIsImlhdCI6MTU5ODUxMTQ1OCwiZXhwIjoxNTk4NTk3ODU4fQ.MF46y1Y2GcGFxSZc8zqVKEmXCIXIdbxIfGs7Y0xhKsY"
}
```

### GET`/parse/:url`
> Warning: you need to encode the url parameter first, with something like encodeURIComponent()
_Returns: `application/json`_
```ts
{
  title: string,
  snippet: string,
  favicon?: string,
  // this will never exist- am skipping this, takes too much time to switch to puppeteer
  'large-image'?: string,
}
```
> Note: this doesn't use any fancy way of finding a content snippet, we populate `snippet` with the first description meta tag the parser finds.

_Example: (first encode the URL so it can be safely appended as a parameter: `encodeURIComponent('https://google.com')` => `"https%3A%2F%2Fgoogle.com"`)_
GET `/parse/https%3A%2F%2Fgoogle.com`
```json
{
  "title": "Google",
  "snippet": "Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for.",
  "favicon": "https://google.com/favicon.ico"
}
```


### GET `/translate/:url`
> Warning: you need to encode the url parameter first, with something like encodeURIComponent()
_Returns: `text/html`_
The translated version of the page body found at the URL.
> Note: This is very limited, the GCloud Translate API only supports up to 30k characters at once. Many modern sites are much longer, due to meta, scripts, assets, etc. We attempt to mitigate this by passing along only the `<body>` node (leaving <head> out), but even so, only small+streamlined pages work. Try Google.com or something.

_Example: (first encode the URL so it can be safely appended as a parameter: `encodeURIComponent('https://google.com')` => `"https%3A%2F%2Fgoogle.com"`)_

GET `/translate/https%3A%2F%2Fgoogle.com`
![Translation output (Insomnia preview)](/screenshot-translation.png)

### POST `/upload`
_Returns: `application/json`_
```ts
{
  identifier: string
}
```

_Example:_

POST `/upload`

Request headers:
`Content-Type: multipart/form-data`

Request body:
`file: <your file>`

Note the form field is literally called `file`.

Response:
```json
{
  "identifier": "5147e4ad-0045-4502-b401-745f0fc9e988.gif"
}
```
In this case you can see it was a gif, but you can upload anything.

### GET `/download/:identifier`

_Returns: `<file mimetype>`_

The file for the given identifier

_Example:_

GET `/download/5814f97f-7045-4e73-8c2c-da298410073c.gif`
![Download output (Insomnia preview)](/screenshot-download.png)

