'use strict';
const axios = require('axios'); 
const axiosInstance = new axios();
const firebase = require('../db.js');
const firestore = firebase.firestore();
const Directions = require('../models/directions');
const request = require('request');
const url = "https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&mode=walking&language=fr-FR&key=AIzaSyBz6IDkIKhoUZeqGTurdyjhrv9T71wEInI";
const url1 = "https://maps.googleapis.com/maps/api/directions/json?origin=";
const url2 ="&destination=";
const url3 = "&mode=walking&language=fr-FR&key=AIzaSyDaVr4sWtVMkvUoKyfq0jF2yPRee4Ez4xw";

const getDirections = async (req, res, next) => {
    
    try {
        let lat = req.body.latitude;
        let lng = req.body.altitude;
        let destination = req.body.destination;
    

        const urlFinal = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+url3;
        const respon = await axios.get(urlFinal);
        let origin = respon.data.results[0].formatted_address;
        origin = origin.replace("é", "e");
        origin = origin.replace("è", "e");
        origin = origin.replace("à", "a");
        destination = destination.replace("é", "e");
        destination = destination.replace("è", "e");
        destination = destination.replace("à", "a");

        var res1 = origin.split(" ");
        var res2 = destination.split(" ");
        origin = res1.join("+");
        destination = res2.join("+");
        let URLCON = url1 + origin + url2 + destination + url3;
        console.log("des "+destination);
        console.log("URLCON "+ URLCON);
        URLCON = URLCON.replace("،", "");
        const response = await axios.get(URLCON);
        let results = response.data.routes[0].legs[0];
        let durationValue = response.data.routes[0].legs[0].duration.value;
        let distanceValue = response.data.routes[0].legs[0].distance.value;
        let nbrSteps = results.steps.length;
        console.log("nbr steps"+nbrSteps);
        const doc = await firestore.collection('steps').doc();
        doc.set(Object.assign({}, results))
        .then(() => {
            const direction = new Directions(doc.id,nbrSteps,distanceValue,durationValue);
            res.send(direction);
            
        });
    } catch (error) {
        console.log("dkhel l error"+error);
        res.status(400).send(error.message);   
    }
}
const getLatLng = async (req, res, next) => {
    
    try {
        let adress = req.body.adress;
        const urlFinal = "https://maps.googleapis.com/maps/api/geocode/json?address="+adress+url3;
        const response = await axios.get(urlFinal);
        let results = response.data.results[0].geometry.location;
          res.send(results);   
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const getAddress = async (req, res, next) => {
    try {
        let lat = req.body.lat;
        let lng = req.body.lng;
        const urlFinal = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+url3;
        const response = await axios.get(urlFinal);
        let results = response.data.results[0].formatted_address;
         res.send(results);   
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const destinationReached = async (req, res, next) => {
    try {
        let id = req.body.id;

        // Create a document reference
        const response = await firestore.collection('steps').doc(id).delete();

        // Remove the 'capital' field from the document
        res.send(response); 

    } catch(error){
        res.status(400).send(error.message);

    }
}
module.exports = {
    getDirections,
    getLatLng,
    getAddress,
    destinationReached
}