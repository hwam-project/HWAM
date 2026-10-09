const videos = [...document.querySelectorAll('.task-video')];
const soundButton = document.querySelector('#video-sound');
const clipStart = 0;
for (const video of videos) {
  const clipEnd = Number(video.dataset.clipEnd || Infinity);
  video.addEventListener('loadedmetadata', () => {
    video.currentTime = Math.min(clipStart, video.duration || clipStart);
    video.play().catch(() => {});
  });
  video.addEventListener('timeupdate', () => {
    if (video.currentTime >= clipEnd || (video.duration && video.currentTime >= video.duration - 0.05)) video.currentTime = clipStart;
  });
  // Check each rendered frame so the cutoff does not rely on sparse timeupdate events.
  if (Number.isFinite(clipEnd) && 'requestVideoFrameCallback' in video) {
    const checkFrame = () => {
      if (video.currentTime >= clipEnd) video.currentTime = clipStart;
      video.requestVideoFrameCallback(checkFrame);
    };
    video.requestVideoFrameCallback(checkFrame);
  }
}
if (soundButton && videos.length) soundButton.addEventListener('click', () => {
  const muted = !videos[0].muted;
  videos.forEach(video => { video.muted = muted; });
  soundButton.textContent = muted ? 'Sound off' : 'Sound on';
});
