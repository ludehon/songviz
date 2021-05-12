const express = require('express');
const app = new express();

app.get('/', function(request, response){
    response.sendFile('index.html', { root: __dirname });
});

app.listen(8080,() => {
    console.log("Server up and running")
})