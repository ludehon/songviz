const socket = io();

socket.on("current_song", (arg) => {
    console.log("song name is : " + arg);
    document.getElementById("current_song").textContent = arg;
});

function askSong() {
    console.log("asking current song...")
    socket.emit("get_current_song", "")
}
setInterval(askSong, 5000);