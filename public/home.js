const socket = io();

// get first update
console.log("first update")
socket.emit("get_current_song", true)

// update song_info
socket.on("current_song", (data) => {
    console.log("-> on current_song")
    document.getElementById("current_song").textContent = data.song_name + " by " + data.artist_name;
    setTheme(data.album_image_link)
});

// update lyrics
socket.on("lyrics", (data) => {
    console.log("-> on lyrics")
    document.getElementById("song_lyrics").innerHTML = data.replace(/\n\r?/g, '<br />');
});

// update page every X seconds
inter = setInterval(askSong, 2000);
function askSong() {
    if (socket.connected) {
        console.log("get song info")
        socket.emit("get_current_song", false)
    } else {
        console.log("disconnected")
        clearInterval(inter)
    }
}

// change background and text color depending on the album image
function setTheme(albumURL) {
    console.log("-> setTheme");
    console.log(albumURL)
    const colorThief = new ColorThief();
    var img = new Image;
    img.crossOrigin = "Anonymous";
    
    img.onload = function() {
        if (img.complete) {
            colors = colorThief.getColor(img);
            r = colors[0];
            g = colors[1];
            b = colors[2];
            console.log("setTheme::colors " + colors)
            // document.body.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
            // document.body.style.backgroundImage = "url('" + albumURL + "')";

            document.getElementById("background_image").style.backgroundImage = "url('" + albumURL + "')";

            if (((r + g + b) / 3) > 130) {
                text_color = "rgb(" + (+r-120) + "," + (+g-120) + "," + (+b-120) + ")";
                console.log("TEXT COLOR " + text_color)
                document.body.style.color = text_color
                // document.getElementById("content").style.color = text_color
            } else {
                text_color = "rgb(" + (+r+120) + "," + (+g+120) + "," + (+b+120) + ")";
                console.log("TEXT COLOR " + text_color)
                document.body.style.color = text_color
            }
        }
    }
    img.src = albumURL
    
    // document.getElementById("body").style.filter = "filter: blur(10px);"
}
