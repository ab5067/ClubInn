const fetch = require("node-fetch");

module.exports = (req, res, next) => {
    
    const parsedData = JSON.parse(req.body);
    if(parsedData.location) {
        var LAT = parsedData.location.coordinates[1];
        var LNG = parsedData.location.coordinates[0];

        let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${LAT},${LNG}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

        fetch(url) 
        .then(response => response.json())
        .then(data => {
            req.formatted_address = data.results[0].formatted_address;
            req.short_address = data.results[5].formatted_address;
            next();
        })
        .catch(err => console.log(err.message));
    } else {
        next();
    }

}