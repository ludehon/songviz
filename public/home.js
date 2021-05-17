const socket = io();

socket.on("current_song", (data) => {
    document.getElementById("current_song").textContent = "currently playing : " + data.song_name;
});

function askSong() {
    socket.emit("get_current_song", "")
}
setInterval(askSong, 5000);