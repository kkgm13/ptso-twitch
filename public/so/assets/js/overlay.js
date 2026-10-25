const overlay = document.querySelector('#overlay');
const avatar = document.querySelector('#avatar');
const streamerName = document.querySelector('#streamer-name');
    // const profileLabel = document.querySelector('#profile-label');
const carouselText = document.querySelector('#carousel-text');
const status = document.querySelector('#status');
const params = new URLSearchParams(location.search);

    // delay is in seconds; each description/game slide lasts 3–5 seconds.
    const delayMs = Math.max(0, Number(params.get('delay') || 0) * 1000);
    const slideMs = Math.min(5000, Math.max(3000, Number(params.get('slideDuration') || 4000)));
    let activeRun = 0;
    let timers = [];

    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }
    function wait(ms) {
      return new Promise(resolve => timers.push(setTimeout(resolve, ms)));
    }
    function setText(element, value) {
      element.textContent = String(value ?? '');
    }
    function validColor(value) {
      return /^#[0-9a-f]{6}$/i.test(value || '') ? value : '#777777';
    }
    function updateAccent(value) {
      const accent = validColor(value);
      overlay.style.setProperty('--accent', accent);
      document.querySelector('#carousel-viewport').style.backgroundColor = accent;
    }

    async function presentShoutout(data) {
      const runId = ++activeRun;
      clearTimers();
      overlay.classList.remove('is-visible', 'is-exiting');
      overlay.setAttribute('aria-hidden', 'true');
      carouselText.className = '';
      setText(status, 'Preparing shoutout');

      await wait(delayMs);
      if (runId !== activeRun) return;

      const displayName = data.displayName || data.username || 'Streamer';
      const descriptions = Array.isArray(data.descriptions)
        ? data.descriptions.map(value => String(value).trim()).filter(Boolean)
        : [];
      if (!descriptions.length) descriptions.push(`Check out ${displayName} and give them a follow!`);
      // The game is deliberately the final carousel slide, matching the original design.
      const slides = [...descriptions, `Last streamed game: ${data.lastGame || 'a variety of games'}`];

      updateAccent(data.streamerColor);
      setText(streamerName, displayName);
      // Preserve the original compact label beneath the avatar, using the channel login.
      // setText(profileLabel, data.username || displayName);
      avatar.src = data.profileImage || '/admin/assets/default.jpeg';
      avatar.onerror = () => {
        avatar.onerror = null;
        avatar.src = '/admin/assets/default.jpeg';
      };

      // Make the full original-style graphic visible before starting the carousel.
      overlay.classList.add('is-visible');
      overlay.setAttribute('aria-hidden', 'false');
      setText(status, 'Showing shoutout');
      await wait(600);
      if (runId !== activeRun) return;

      for (let index = 0; index < slides.length; index++) {
        if (runId !== activeRun) return;
        carouselText.className = 'entering';
        setText(carouselText, slides[index]);
        await wait(slideMs);
        if (runId !== activeRun) return;
        carouselText.className = index < slides.length - 1 ? 'leaving-left' : 'leaving-right';
        await wait(350);
      }

      if (runId !== activeRun) return;
      overlay.classList.remove('is-visible');
      overlay.classList.add('is-exiting');
      overlay.setAttribute('aria-hidden', 'true');
      await wait(500);
      if (runId !== activeRun) return;
      overlay.classList.remove('is-exiting');
      carouselText.className = '';
      setText(carouselText, '');
      setText(status, 'Waiting for shoutout');
    }

    // The page stays transparent until the matching backend event arrives.
    const channel = (params.get('channel') || '').trim().toLowerCase();
    const events = channel
      ? new EventSource(`/api/shoutout/events?channel=${encodeURIComponent(channel)}`)
      : null;

    if (!events) {
      setText(status, 'Missing channel parameter');
      console.error('PTSO overlay URL must include ?channel=<twitch-login>.');
    }
    events?.addEventListener('shoutout', event => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.type === 'shoutout') void presentShoutout(payload);
      } catch (error) {
        console.error('PTSO received an invalid shoutout event:', error);
      }
    });
    events?.addEventListener('connected', () => setText(status, 'Waiting for shoutout'));
    events?.addEventListener('error', () => setText(status, 'Reconnecting to PTSO'));

    if (params.get('demo') === 'true') {
      window.setTimeout(() => presentShoutout({
        username: 'STREAMER',
        displayName: 'STREAMER',
        profileImage: '/admin/assets/default.jpeg',
        streamerColor: '#777777',
        descriptions: [
          'Streamer, variety content creator',
          'Come check out the channel',
          'Give them a follow'
        ],
        lastGame: 'Just Chatting'
      }), 500);
    }