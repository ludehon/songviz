window.onload = function() {
    console.log("PAGE LOADED")
    // need to get current song here 
};

socket.on('current_song', function(msg) {
    console.log(msg)
});