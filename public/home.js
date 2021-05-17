const socket = io();

// update song_info
socket.on("current_song", (data) => {
    console.log("on current_song")
    document.getElementById("current_song").textContent = data.song_name + " by " + data.artist_name;
    setTheme(data.album_image_link)
});

// update lyrics
socket.on("lyrics", (data) => {
    console.log("on lyrics")
    document.getElementById("song_lyrics").innerHTML = data.replace(/\n\r?/g, '<br />');
});

// update page every X seconds
inter = setInterval(askSong, 2000);
function askSong() {
    if (socket.connected) {
        console.log("get song info")
        socket.emit("get_current_song", "")
    } else {
        console.log("disconnected")
        clearInterval(inter)
    }
}

function setTheme(albumURL) {
    console.log("album url " + albumURL)
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
            document.body.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
            if (((r + g + b) / 3) > 130) {
                text_color = "rgb(" + (+r-120) + "," + (+g-120) + "," + (+b-120) + ")";
                console.log("TEXT COLOR " + text_color)
                document.body.style.color = text_color
            } else {
                text_color = "rgb(" + (+r+120) + "," + (+g+120) + "," + (+b+120) + ")";
                console.log("TEXT COLOR " + text_color)
                document.body.style.color = text_color
            }
        }
    }
    img.src = albumURL
}