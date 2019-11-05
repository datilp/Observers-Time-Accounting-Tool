const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const app = express();
const port = process.env.PORT || 5000;



var form = {'name': "igor", 'cat': 'Copi'};
const formData = new FormData(form);
//formData.append('name', "igor");
//formData.append('cat', 'Copi');

const instance = axios.create({
  baseURL: 'http://localhost/cgi-bin'
});
/*axios({
    url: 'http://localhost/cgi-bin/axios.pl',
    method: 'post',
//    data: formData,
//    config: { headers: {'Content-Type': 'multipart/form-data' }}
    data: {
      foo: 'bar'
    }
  }).then();
  */

instance.post("/axios.pl", {
      foo: 'bar'
}).then();

instance.post("/axios.pl", 
formData).then();

