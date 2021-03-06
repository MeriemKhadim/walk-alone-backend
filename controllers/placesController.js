'use strict';
const axios = require('axios'); 
let url = require('url')
let bodyParser = require('body-parser')
const Adr = require('../models/adresses');


let getPlaces = async (req, res, next) => {
//get the query from the url and parse it
//let query = url.parse(req.url, true).query
//get the location from the query
let ourQuery = req.params.name;

console.log(ourQuery);
let addresses=[]
//convert the location string into an array
ourQuery = ourQuery.replace("é", "e");
ourQuery = ourQuery.replace("è", "e");
ourQuery = ourQuery.replace("à", "a");
var resu = ourQuery.split(" ");
//convert the array into a string linked with + signs
let str2=resu.join("+")+'+marrakech'
let str1='https://maps.googleapis.com/maps/api/place/textsearch/json?query='
let str3='&key=AIzaSyDaVr4sWtVMkvUoKyfq0jF2yPRee4Ez4xw'
//create the query we are going to send to our google places api
 let Q=str1 +str2 +str3;
//make an async request to the api
  try { 
        //get the result of the call in a parsed json format
      const response = await axios.get(Q)
      //extract result that contains the wanted data
      let results=response.data.results;
      
      results.forEach(element => {
        //extract the formatted_address of ead element 
        if(element.formatted_address!='Marrakesh 40000, Morocco'){
            var adressF=new Adr(element.formatted_address);
            //push the formatted addresses to adresses array
            addresses.push(adressF)
        }}); 
        
        res.json(addresses);
        
    } catch (error) {
        console.log(error);
      }
}
module.exports = {
  getPlaces,
}