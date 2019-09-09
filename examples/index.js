import { get } from '@lykmapipo/http-client';

process.env.BASE_URL = 'https://api.github.com/repositories';

// send get request
get()
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.log(error);
  });
