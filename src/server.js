const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const moment = require('moment-timezone');
const app = express();
const port = process.env.PORT || 5000;



var form = {'name': "igor", 'cat': 'Copi'};
const formData = new FormData(form);
//formData.append('name', "igor");
//formData.append('cat', 'Copi');
/* good
const instance = axios.create({
  baseURL: 'http://localhost/cgi-bin'
});

instance.post("/axios.pl", {
      foo: 'bar'
}).then();

instance.post("/axios.pl", 
formData).then();
*/

console.log(moment.locale());

console.log(moment("2019-11-04T16:21:00").tz("America/Phoenix").format());

console.log(new Date("2019-11-04T16:21:00Z") - new Date("2019-11-04T09:21:00-07:00"))

//console.log(moment.tz("2019-11-04T16:21:00", "UTC"), moment.tz("2019-11-04T09:21:00", "America/Toronto"));

console.log(new Date(moment.tz("2019-11-04T16:21:00", "UTC")), new Date(moment.tz("2019-11-04T09:21:00", "America/Phoenix")));


console.log(moment("2019-11-04T16:21:00").tz("UTC") - moment("2019-11-04T09:21:00").tz("America/Toronto"));

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}
console.log(new Date(), new Date().addHours(80));


console.log(new Date(moment.tz("2019-11-04T09:21:00", "America/Phoenix").add(11.4, 'hours')), 
moment.tz("2019-11-04T18:21:00-07:00", "America/Phoenix").add(11.4, 'hours').format(),
moment.tz("2019-11-04T18:21:00", "America/Phoenix").add(11.42, 'hours').format(),
moment("2019-11-04T18:21:00-07:00").add(11.42, 'hours').format()
);

const nightEnd = moment("2019-11-04T18:21:00-07:00").add(11.42, 'hours');

console.log(nightEnd.toDate() < new Date());
console.log(nightEnd.toDate());

