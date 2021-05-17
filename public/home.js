const socket = io();

socket.on("current_song", (data) => {
    console.log("on current_song")
    document.getElementById("current_song").textContent = data.song_name + " by " + data.artist_name;
});

socket.on("lyrics", (data) => {
    console.log("on lyrics")
    document.getElementById("song_lyrics").innerHTML = data.replace(/\n\r?/g, '<br />');
});

inter = setInterval(askSong, 5000);
function askSong() {
    if (socket.connected) {
        console.log("get song info")
        socket.emit("get_current_song", "")
    } else {
        console.log("disconnected")
        clearInterval(inter)
    }
}