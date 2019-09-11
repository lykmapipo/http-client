#### createHttpClient([optns]) 

Create http client if not exists




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| optns | `object`  | valid http client options | *Optional* |




##### Examples

```javascript

const optns = { baseURL: ... };
const httpClient = createHttpClient();
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

const getUsers = request('/users');
getUsers.then(response => { ... }).catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with raw response on success or error on failure.



#### del(url[, optns&#x3D;{}]) 

Issue http delete request to specified url.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| url | `string`  | valid http path. | &nbsp; |
| optns&#x3D;{} | `object`  | valid request options. | *Optional* |




##### Examples

```javascript

const deleteUser = del('/users/5c1766243');
deleteUser.then(user => { ... }).catch(error => { ... });
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
const getUsers = get('/users', { params });
getUsers.then(users => { ... }).catch(error => { ... });

// single
const getUser = get('/users/5c1766243');
getUser.then(user => { ... }).catch(error => { ... });
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

const headUser = head('/users/5c1766243');
headUser.then({ headers } => { ... }).catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with raw response on success or error on failure.



#### options(url[, optns&#x3D;{}]) 

Issue http options request to specified url.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| url | `string`  | valid http path. | &nbsp; |
| optns&#x3D;{} | `object`  | valid request options. | *Optional* |




##### Examples

```javascript

const optionUser = options('/users/5c1766243');
optionUser.then({ headers } => { ... }).catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with raw response on success or error on failure.



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

const patchUser = patch('/users', { age: 14 });
patchUser.then(user => { ... }).catch(error => { ... });
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

const postUser = post('/users', { age: 14 });
postUser.then(user => { ... }).catch(error => { ... });
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

const putUser = put('/users', { age: 14 });
putUser.then(user => { ... }).catch(error => { ... });
```


##### Returns


- `Promise`  promise resolve with data on success or error on failure.




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
