document.addEventListener('DOMContentLoaded', function() {
    const player = new Plyr('#player', {
        controls: [
            'play-large',
            'restart',
            'rewind',
            'play',
            'fast-forward',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'captions',
            'settings',
            'pip',
            'airplay',
            'fullscreen'
        ],
        settings: ['captions', 'quality', 'speed'],
        quality: {
            default: 1080,
            options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
        },
        speed: {
            selected: 1,
            options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
        }
    });

    function loadVideo(url, type) {
        const videoElement = document.querySelector('#player');
        
        if (type === 'mp4') {
            videoElement.src = url;
        } else if (type === 'm3u8') {
            if (Hls.isSupported()) {
                const hls = new Hls({
                    maxLoadingDelay: 4,
                    maxRetryAttempts: 8,
                    maxBufferLength: 30
                });
                hls.loadSource(url);
                hls.attachMedia(videoElement);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    videoElement.play();
                });
            } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                videoElement.src = url;
            }
        } else if (type === 'mpd') {
            const dashPlayer = dashjs.MediaPlayer().create();
            dashPlayer.initialize(videoElement, url, true);
            dashPlayer.updateSettings({
                'streaming': {
                    'fastSwitchEnabled': true,
                    'abr': {
                        'autoSwitchBitrate': {
                            'video': true
                        }
                    }
                }
            });
        }
    }

    // Example usage:
    // loadVideo('https://linear-843.frequency.stream/mt/studio/843/hls/master/playlist.m3u8');
      // loadVideo('https://example.com/video.mp4', 'mp4');
    // loadVideo('https://example.com/manifest.mpd', 'mpd');
});
