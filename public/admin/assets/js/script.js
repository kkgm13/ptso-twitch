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

const { createApp, reactive, ref, onMounted, nextTick} = Vue;
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

        const submitStreamer = async () => {
            // console.log(streamer)
            formError.value = '';
            try {
                const method = streamer.twitchId ? 'PUT' : 'POST';
                if (!streamer.twitchId) {
                    const res = await fetch(`/api/streamer?username=${encodeURIComponent(streamer.streamerName)}`);
                    const data = await res.json();
                    streamer.twitchId = data.twitchId;
                }
                const url = streamer.twitchId ? `/api/streamer/${streamer.twitchId}` : '/api/streamer';
        
                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        streamerName: streamer.streamerName,
                        streamerDetails: streamer.streamerDetails,
                        streamerColor: streamer.streamerColor
                    })
                });
        
                if (!res.ok) throw new Error('Failed to save streamer');
        
                if (!streamer.id) {
                    const newEntry = await res.json();
                    streamerList.push({ ...streamer, id: newEntry.id });
                } else {
                    const index = streamerList.findIndex(s => s.id === streamer.id);
                    if (index !== -1) {
                        streamerList[index] = { ...streamer };
                    }
                }
        
                resetForm();
            } catch (err) {
                console.error('Submit error:', err.message);
                formError.value = err.message;
            }
        };

        const editStreamer = (streamerData) => {
            streamer.id = streamerData.id;
            streamer.twitchId = streamerData.twitchId;
            streamer.streamerName = streamerData.streamerName;
            streamer.streamerDetails = streamerData.streamerDetails;
            streamer.streamerColor = streamerData.streamerColor;
        };

        const deleteStreamer = async (id) => {
            if (!confirm('Are you sure you want to delete this streamer?')) return;
        console.log(id)
            try {
                const res = await fetch(`/api/streamer/${id}`, {
                    method: 'DELETE'
                });
        
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || 'Unknown delete error');
                }
        
                // Remove from frontend list after successful DB delete
                await fetchStreamers();
            } catch (err) {
                console.error('Delete error:', err.message);
                formError.value = err.message;
            }
        };
        

        const fetchStreamers = async () => {
            try {
                const res = await fetch('/api/streamers');
                const data = await res.json();
                if (res.ok) {
                    streamerList.splice(1, streamerList.length, ...data.streamers);
                    // 🛠 Trigger Lucide to re-render icons
                    nextTick(() => {
                        lucide.createIcons();
                    });
                } else {
                    throw new Error(data.error || 'Could not fetch streamers');
                }
            } catch (err) {
                console.error('Fetch error:', err.message);
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

        onMounted(() => {
            fetchStreamers();
        });

        return {
            streamer,
            streamerList,
            submitStreamer,
            resetForm,
            formError,
            editStreamer,
            deleteStreamer
        };
    }
}).mount('#app');