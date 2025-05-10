window.onload = function() {
    alert("Welcome to the Personal Textual Shoutout Overlay (PTSO) for Twitch!\nPlease note some functionality is still being developed.");
};

document.addEventListener('DOMContentLoaded', () => {  
    lucide.createIcons();

    const tabLinks = document.querySelectorAll(".tab-link");
    const tabContents = document.querySelectorAll(".tab-content");

    tabLinks.forEach(link => {
        link.addEventListener("click", () => {
            const targetId = link.getAttribute("data-tab");

            tabLinks.forEach(l => {
                l.classList.remove("text-blue-600", "border-blue-600");
                l.classList.add("text-gray-500", "border-transparent");
            });

            tabContents.forEach(content => {
                content.classList.add("hidden");
            });

            const activeTab = document.getElementById(targetId);
            if (activeTab) {
                activeTab.classList.remove("hidden");
            }

            link.classList.add("text-blue-600", "border-blue-600");
            link.classList.remove("text-gray-500", "border-transparent");
        });
    });
});

const { createApp, reactive, ref } = Vue;

createApp({
    setup() {
        const streamer = reactive({
            id: null,
            twitchId: '',
            streamerName: '',
            streamerDetails: '',
            streamerColor: '#666666',
        });

        const streamerList = reactive([]);
        const formError = ref('');

        // const TWITCH_CLIENT_ID = 'YOUR_CLIENT_ID';
        // const TWITCH_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';

        const TWITCH_CLIENT_ID = 'wrn9wrhih9aa5miji8a0wd4ko4hs88';
        const TWITCH_ACCESS_TOKEN = 'sh83qlcpz0imoes60t5c415unt3b2d';

        // const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
        // const TWITCH_ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN;

        const fetchTwitchUser = async (username) => {
            try {
                let res = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
                    method: 'GET',
                    headers: {
                        'Client-ID': TWITCH_CLIENT_ID,
                        'Authorization': `Bearer ${TWITCH_ACCESS_TOKEN}`,
                    },
                });

                let data = res.json();

                if (!data.data || data.data.length === 0) {
                    throw new Error('Streamer not found on Twitch.');
                }

                return data.data[0].id; // Twitch User ID
            } catch (err) {
                throw err;
            }
        };

        const submitStreamer = async () => {
            formError.value = '';
            try {
                const twitchId = await fetchTwitchUser(streamer.streamerName);
                console.log('HIT')
                streamer.twitchId = twitchId;

                if (streamer.id) {
                    const index = streamerList.findIndex(s => s.id === streamer.id);
                if (index !== -1) {
                    streamerList[index] = { ...streamer };
                }
                } else {
                    streamerList.push({ ...streamer, id: Date.now() });
                }
                resetForm();
            } catch (err) {
                formError.value = err.message;
            }
        };

        const resetForm = () => {
            streamer.id = null;
            streamer.twitchId = '';
            streamer.streamerName = '';
            streamer.streamerDetails = '';
            streamer.streamerColor = '#666666';
            formError.value = '';
        };

        return {
            streamer,
            streamerList,
            submitStreamer,
            resetForm,
            formError,
        };
    }
}).mount('#app');