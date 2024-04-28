var startTime;
var endTime;
var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtubeVideo', {
        events: {
            'onReady': onPlayerReady,
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function calculateTime() {
    var fps = parseFloat(document.getElementById('fps').value);

    if (isNaN(startTime) || isNaN(endTime) || isNaN(fps)) {
        document.getElementById('result').innerHTML = "Invalid input";
    } else {
        var frameDuration = 1 / fps

        var startFrameTime = Math.round(startTime / frameDuration) * frameDuration;
        var endFrameTime = Math.round(endTime / frameDuration) * frameDuration;

        var differenceInFrames = (endFrameTime - startFrameTime) * fps;
        var differenceInSeconds = differenceInFrames / fps;

        var formattedTime = formatTime(differenceInSeconds);

        document.getElementById('result').innerHTML = "Total frames: " + Math.round(differenceInFrames) + ", Total time: " + formattedTime;
        document.getElementById('modMessage').innerHTML = "Mod Note: Start Frame (" + Math.round(startFrameTime * fps) + "), End Frame: (" + Math.round(endFrameTime * fps) + "), FPS: (" + fps + "), Time: (" + formattedTime + ")";
    }
}

function extractTime(debugInfo) {
    var debugJson = JSON.parse(debugInfo);
    return parseFloat(debugJson.vct);
}

document.getElementById('modeSwitcher').addEventListener('click', function(event) {
    event.preventDefault()
    var body = document.body;
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        this.innerHTML = "Switch to Dark Mode"
        localStorage.setItem('theme', 'light')
    } else {
        body.classList.add('dark-mode');
        this.innerHTML = "Switch to Light Mode";
        localStorage.setItem('theme', 'dark')
    }
})

document.getElementById('copyButton').addEventListener('click', function(event) {
    event.preventDefault()
    var modMessage = document.getElementById('modMessage').innerHTML;

    navigator.clipboard.writeText(modMessage)
    this.innerHTML = "Copied!";
    var button = this;

    setTimeout(function() {
        button.innerHTML = "Copy Mod Note";
    }, 2000);
});

var totalTime = 0;

function addTime() {
    var addTimeInput = document.getElementById('addTimeInput').value;
    
    var timeParts = addTimeInput.split(':');
    var minutes = parseFloat(timeParts[0]);
    var seconds = timeParts.length > 1 ? parseFloat(timeParts[1]) : 0;

    var addTimeInSeconds = minutes * 60 + seconds

    if (!isNaN(addTimeInSeconds)) {
        totalTime += addTimeInSeconds;
        var formattedTime = formatTime(totalTime)
        document.getElementById('totalTime').innerHTML = "Total Time: " + formattedTime + " seconds";
    } else {
        document.getElementById('totalTime').innerHTML = "Invalid input. Please enter a number.";
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(3);

    return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}

function loadVideo() {
    var youtubeLink = document.getElementById('youtubeLink').value;
    var videoId = youtubeLink.split('v=')[1] || youtubeLink.split('be/')[1];
    var ampersandPosition = videoId.indexOf('&');
    if(ampersandPosition != -1) {
        videoId = videoId.substring(0, ampersandPosition);
    }

    document.getElementById('youtubeVideo').src = "https://www.youtube.com/embed/" + videoId + "?enablejsapi=1";
}

function setStartTime() {
    startTime = player.getCurrentTime();
}

function setEndTime() {
    endTime = player.getCurrentTime();
}

window.onload = function() {
    var theme = localStorage.getItem('theme');
    var body = document.body;
    if (theme === 'dark') {
        body.classList.add('dark-mode');

        document.getElementById('modeSwitcher').innerHTML = "Switch to Light Mode";
    } else {
        body.classList.remove('dark-mode')

        document.getElementById('modeSwitcher').innerHTML = "Switch to Dark Mode";
    }
}