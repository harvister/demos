document.addEventListener('DOMContentLoaded', async () => {
  const streamRes = await fetch("https://gist.githubusercontent.com/harvister/89b0eb6d7a74f6179cc0a9cd8869948f/raw/8abf63e51983fed1b8458cf07f57cf0a6f4d8f51/stream.json");
  if (!streamRes.ok) {
    console.error(await res.text());
    throw new Error("couldn't get list");
  }
  const source = (await streamRes.json()).url;;
  const video = document.querySelector('video');

  const player = new Plyr(video, { captions: { active: true, update: true, language: 'en' } });

  if (!Hls.isSupported()) {
    video.src = source;
  } else {
    // For more Hls.js options, see https://github.com/dailymotion/hls.js
    const hls = new Hls();
    hls.loadSource(source);
    hls.attachMedia(video);
    window.hls = hls;

    // Handle changing captions
    player.on('languagechange', () => {
      // Caption support is still flaky. See: https://github.com/sampotts/plyr/issues/994
      setTimeout(() => hls.subtitleTrack = player.currentTrack, 50);
    });
  }

  window.player = player;
});
