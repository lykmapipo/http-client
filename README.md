# http-client

[![Build Status](https://travis-ci.org/lykmapipo/http-client.svg?branch=master)](https://travis-ci.org/lykmapipo/http-client)
[![Dependencies Status](https://david-dm.org/lykmapipo/http-client.svg)](https://david-dm.org/lykmapipo/http-client)
[![Coverage Status](https://coveralls.io/repos/github/lykmapipo/http-client/badge.svg?branch=master)](https://coveralls.io/github/lykmapipo/http-client?branch=master)
[![GitHub License](https://img.shields.io/github/license/lykmapipo/http-client)](https://github.com/lykmapipo/http-client/blob/master/LICENSE) 

[![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![npm version](https://img.shields.io/npm/v/@lykmapipo/http-client)](https://www.npmjs.com/package/@lykmapipo/http-client)

Helper utilities for making HTTP(s) requests.

## Requirements

- [NodeJS v12+](https://nodejs.org)
- [Npm v6+](https://www.npmjs.com/)

## Installation

```sh
npm install --save @lykmapipo/http-client
```

## Usage

```js
import { request, del, get } from '@lykmapipo/http-client';

request({ url: '/users' }).then(response => { ... }).catch(error => { ... });

del('/users/5c1766243').then(user => { ... }).catch(error => { ... });

get('/users').then(users => { ... }).catch(error => { ... });
```

## Test

- Clone this repository

- Install all dependencies

```sh
npm install
```

- Then run test

```sh
npm test
```

## Contribute

It will be nice, if you open an issue first so that we can know what is going on, then, fork this repo and push in your ideas. Do not forget to add a bit of test(s) of what value you adding.

## LICENSE

MIT License

Copyright (c) lykmapipo & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
