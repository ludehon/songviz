var SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')
const fs = require('fs');

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];

let rawCredentials = fs.readFileSync('credentials.json');
let credentials = JSON.parse(rawCredentials);

var spotifyApi = new SpotifyWebApi({
    clientId: credentials['clientId'],
    clientSecret: credentials['clientSecret'],
    redirectUri: credentials['redirectUri']
});

const app = express();

app.get('/login', function(req, res){
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            const access_token = data.body['access_token'];
            process.env['SPOTIFY_ACCESS_TOKEN'] = access_token
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];

            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);

            console.log(
                `Sucessfully retreived access token. Expires in ${expires_in} s.`
            );
            
            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body['access_token'];

                console.log('The access token has been refreshed!');
                console.log('access_token:', access_token);
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 1000);

            res.redirect('/home');
        })
        .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
        });
});

app.get('/', function(request, response){
    response.sendFile('index.html', { root: __dirname });
});

app.get('/home', function(request, response){
    if (process.env['SPOTIFY_ACCESS_TOKEN']) {
        console.log("ACCESS TOKEN OK")
    } else {
        console.log("NO ACCESS TOKEN")
    }
    response.sendFile('home.html', { root: __dirname });
});

app.listen(8888,() => {
    console.log("Server up and running")
})