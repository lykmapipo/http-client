#### withDefaults([optns]) 

Merge provided options with defaults.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| optns | `object`  | provided options | *Optional* |




##### Examples

```javascript

const optns = { baseUrl: ... };
const options = withDefaults(optns);
// => {baseUrl: ..., headers: { ... } };
```


##### Returns


- `object`  merged options



#### createAgents([optns]) 

Create http or https agent from options.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| optns | `object`  | provided request options | *Optional* |
| optns.agentOptions | `object`  | valid http(s) agent options | *Optional* |
| optns.agentOptions.ca | `string`  | valid ca | *Optional* |
| optns.agentOptions.cert | `string`  | valid cert | *Optional* |
| optns.agentOptions.key | `string`  | valid key | *Optional* |
| optns.agentOptions.passphrase | `string`  | valid passphrase | *Optional* |




##### Examples

```javascript

const optns = {
 agentOptions: {
  cert: fs.readFileSync(certFilePath),
  key: fs.readFileSync(keyFilePath),
  passphrase: 'password',
  ca: fs.readFileSync(caFilePath),
  ...
 }
};

const options = createAgents(optns);
// => { httpAgent: ..., httpsAgent: ... };
```


##### Returns


- `object`  valid http or https agent



#### isFormData(value) 

Determine if a value is a FormData




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| value |  | data to test | &nbsp; |




##### Examples

```javascript

isFormData({});
// => false;

* isFormData(new FormData());
// => true;
```


##### Returns


- `boolean`  true if value is an FormData, otherwise false



#### toFormData([data&#x3D;{}]) 

Convert given plain object to form data instance




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| data&#x3D;{} | `object`  | valid data | *Optional* |




##### Examples

```javascript

const data = toFormData({ ... });
// => FormData{ ... };
```


##### Returns


- `object`  valid form data instance



#### normalizeRequest([request&#x3D;{}]) 

Normalize http request with sensible config




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| request&#x3D;{} | `object`  | valid request options | *Optional* |




##### Examples

```javascript

const request = normalizeRequest({ ... }).
// => { ... };
```


##### Returns


- `object`  normalize request options



#### mapResponseToData(rawResponse) 

Convert raw http response to data




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| rawResponse | `object`  | raw http response | &nbsp; |




##### Examples

```javascript

const data = mapResponseToData(rawResponse).
// => { .. };
```


##### Returns


- `object`  response data



#### mapResponseToError(rawResponse) 

Convert raw http response error to js native error




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| rawResponse | `object`  | raw http response | &nbsp; |




##### Examples

```javascript

const error = mapResponseToError(rawResponse).
// => Error;
```


##### Returns


- `Error`  response error



#### wrapRequest(request[, skipData&#x3D;false]) 

Wrap http request and convert raw response to error or data




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| request | `Promise`  | valid http request | &nbsp; |
| skipData&#x3D;false | `boolean`  | whether to skip map raw response to data | *Optional* |




##### Examples

```javascript

const wrappedRequest = wrapRequest(request).
// => Promise;
```


##### Returns


- `Promise`  request with normalized response error and data



#### createHttpClient([optns]) 

Create http client if not exists




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| optns | `object`  | valid http client options | *Optional* |




##### Examples

```javascript

const optns = { baseURL: ... };
const httpClient = createHttpClient(optns);
```


##### Returns


- `object`  instance of http client



#### disposeHttpClient() 

Clear current http client in use.






##### Examples

```javascript

const httpClient = disposeHttpClient();
// => null
```


##### Returns


- `object`  null if client clear otherwise existing client;



#### request(optns) 

Issue http request using given options.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| optns | `object`  | valid request options | &nbsp; |




##### Examples

```javascript

request('/users')
  .then(response => { ... })
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with raw http response on success or error on failure.



#### spread() 

Flattened array fullfillment to the formal parameters of the fulfillment handler.






##### Examples

```javascript

const getRoles = get('/roles');
const getUsers = get('/users');
const requests = all(getRoles(), getUsers());
request.then(spread((roles, users) => { ... }));
```


##### Returns


- `Void`



#### all(requests) 

Performing multiple concurrent http requests.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| requests | `Array.<object>`  | valid http requests | &nbsp; |




##### Examples

```javascript

const getRoles = get('/roles');
const getUsers = get('/users');
const requests = all(getRoles(), getUsers());
request.then(spread((roles, users) => { ... }));
```


##### Returns


- `Promise`  promise resolve with http response on success or error on failure.



#### del(url[, optns&#x3D;{}]) 

Issue http delete request to specified url.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| url | `string`  | valid http path. | &nbsp; |
| optns&#x3D;{} | `object`  | valid request options. | *Optional* |




##### Examples

```javascript

del('/users/5c1766243')
  .then(user => { ... })
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with data on success or error on failure.



#### get(url[, optns&#x3D;{}]) 

Issue http get request to specified url.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| url | `string`  | valid http path. | &nbsp; |
| optns&#x3D;{} | `object`  | valid request options. | *Optional* |
| optns.params | `object`  | params that will be encoded into url query params. | *Optional* |




##### Examples

```javascript

// list
const params = { age: { $in: [1, 2] } };
get('/users', { params })
  .then(users => { ... })
  .catch(error => { ... });

// single
get('/users/5c1766243')
  .then(user => { ... })
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with data on success or error on failure.



#### head(url[, optns&#x3D;{}]) 

Issue http head request to specified url.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| url | `string`  | valid http path. | &nbsp; |
| optns&#x3D;{} | `object`  | valid request options. | *Optional* |




##### Examples

```javascript

head('/users/5c1766243')
  .then({ headers } => { ... })
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with raw http response on success or error on failure.



#### options(url[, optns&#x3D;{}]) 

Issue http options request to specified url.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| url | `string`  | valid http path. | &nbsp; |
| optns&#x3D;{} | `object`  | valid request options. | *Optional* |




##### Examples

```javascript

options('/users/5c1766243')
  .then({ headers } => { ... })
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with raw http response on success or error on failure.



#### patch(url, data[, optns&#x3D;{}]) 

Issue http patch request to specified url.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| url | `string`  | valid http path. | &nbsp; |
| data | `object`  | request payload to be encoded on http request body | &nbsp; |
| optns&#x3D;{} | `object`  | valid request options. | *Optional* |




##### Examples

```javascript

// json request
patch('/users/5c1766243', { age: 14 })
  .then(user => { ... })
  .catch(error => { ... });

// multipart request
patch('/users/5c1766243', { age: 14 }, { multipart: true })
  .then(user => { ... })
  .catch(error => { ... });

// multipart request using form data
const form = new FormData()
patch('/users/5c1766243', form)
  .then(user => { ... })
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with data on success or error on failure.



#### post(url, data[, optns&#x3D;{}]) 

Issue http post request to specified url.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| url | `string`  | valid http path. | &nbsp; |
| data | `object`  | request payload to be encoded on http request body | &nbsp; |
| optns&#x3D;{} | `object`  | valid request options. | *Optional* |




##### Examples

```javascript

// json request
post('/users', { age: 14 })
  .then(user => { ... })
  .catch(error => { ... });

// multipart request
post('/users', { age: 14 }, { multipart: true })
  .then(user => { ... })
  .catch(error => { ... });

// multipart request using form data
const form = new FormData()
post('/users', form)
  .then(user => { ... })
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with data on success or error on failure.



#### put(url, data[, optns&#x3D;{}]) 

Issue http put request to specified url.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| url | `string`  | valid http path. | &nbsp; |
| data | `object`  | request payload to be encoded on http request body | &nbsp; |
| optns&#x3D;{} | `object`  | valid request options. | *Optional* |




##### Examples

```javascript

// json request
put('/users/5c1766243', { age: 14 })
  .then(user => { ... })
  .catch(error => { ... });

// multipart request
put('/users/5c1766243', { age: 14 }, { multipart: true })
  .then(user => { ... })
  .catch(error => { ... });

// multipart request using form data
const form = new FormData()
put('/users/5c1766243', form)
  .then(user => { ... })
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with data on success or error on failure.



#### sendFile(url, data[, optns&#x3D;{}]) 

Issue http multipart request to specified url.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| url | `string`  | valid http path. | &nbsp; |
| data | `object`  | request payload to be encoded on http request body | &nbsp; |
| optns&#x3D;{} | `object`  | valid request options. | *Optional* |




##### Examples

```javascript

// send stream
const image = fs.createReadStream(imagePath);
sendFile('/files', { image })
  .then(file => { ... })
  .catch(error => { ... });

// send buffer
const image = fs.readFileSync(imagePath);
sendFile('/files/5c1766243', { image }, { method: 'PATCH'})
  .then(file => { ... })
  .catch(error => { ... });

// send form data
const image = document.getElementById('file').files[0];
sendFile('/files', { image })
  .then(file => { ... })
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with data on success or error on failure.



#### fetchFile(url[, optns&#x3D;{}]) 

Issue http get request to fetch file from given url.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| url | `string`  | valid http path. | &nbsp; |
| optns&#x3D;{} | `object`  | valid request options. | *Optional* |
| optns.params | `object`  | params that will be encoded into url query params. | *Optional* |




##### Examples

```javascript

fetchFile('/files/5c1766243')
  .then(stream => { ... })
  .catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with file stream on success or error on failure.




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
