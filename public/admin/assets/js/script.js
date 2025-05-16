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

const { createApp, reactive, ref, onMounted, nextTick, computed, watch} = Vue;
createApp({
    setup() {
        const streamer = reactive({
            twitchId: '',
            streamerName: '',
            streamerDetails: '',
            streamerColor: '#666666',
        });

        const streamerList = reactive([]);
        const formError = ref('');
        const filteredSearch = ref('');

        const submitStreamer = async () => {
            formError.value = '';
            try {
                // If Id is not filled
                if (!streamer.twitchId) {
                    // Find Streamer in Twitch API
                    const res = await fetch(`/api/streamer?username=${encodeURIComponent(streamer.streamerName)}`);
                    const data = await res.json();
                    // Set Twitch ID
                    streamer.twitchId = data.twitchId;
                }

                const url = streamer.twitchId ? `/api/streamers` : '/api/streamer';
                const method = streamer.twitchId ? 'PUT' : 'POST';

                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...streamer })
                });
        
                if (!res.ok){
                    console.log(res.err);
                    throw new Error('Failed to save streamer');
                }
        
                await fetchStreamers();
                resetForm();
            } catch (err) {
                console.error('Submit error:', err.message);
                formError.value = err.message;
            }
        };

        const editStreamer = (streamerData) => {
            Object.assign(streamer, { ...streamerData });
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

        const filteredStreamers = computed(() => {
            let query = filteredSearch.value.toLowerCase();
            return streamerList.filter(streamer =>
                streamer.streamerName.toLowerCase().includes(query)
            );
        }); 

        const fetchStreamers = async () => {
            try {
                const res = await fetch('/api/streamers');
                const data = await res.json();
                if (res.ok) {
                    streamerList.splice(0, streamerList.length, ...data.streamers);
                } else {
                    throw new Error(data.error || 'Could not fetch streamers');
                }
                await nextTick();
                lucide.createIcons(); // Refresh icons after DOM updates
            } catch (err) {
                console.error('Fetch error:', err.message);
            }
        };

        const resetForm = () => {
            streamer.twitchId = '';
            streamer.streamerName = '';
            streamer.streamerDetails = '';
            streamer.streamerColor = '#666666';
            formError.value = '';
        };

        const urlGenerate = () => {
            let fullUrl = ''
            if (!document.getElementById('mainAccount').value) {
                alert('Your Twitch Username is not set');
            } else {
                let timeout = document.getElementById('timeoutSize').value
                let delay = document.getElementById('delaySize').value
                let command = document.getElementById('commands').value
                let raided = document.getElementById('isRaid').value
                let raidCount = document.getElementById('raidNumber').value

                fullUrl += window.location.protocol + "//" + window.location.host + window.location.pathname.split('admin/')[0] + "so.html?channel=" + document.getElementById('mainAccount').value.toLowerCase()+ "&showMsg=false&modsOnly=true"
                // console.log("1: "+fullUrl)
                if(parseInt(delay) != 0){
                    fullUrl += "&delay=" + delay
                    // console.log("2: "+fullUrl)
                }
                if(parseInt(timeout) != 0){
                    fullUrl += "&timeOut=" + timeout
                    // console.log("3: "+fullUrl)
                }
                // If other command for SO is used
                    // TODO: Figure out /shoutout ASAP
                if(command.includes("so") || !command === ""){
                    fullUrl += "&command=" + command;
                    // console.log("4: "+fullUrl)
                }
                // If Channel Raiding Is considered
                if(raided === true){
                    fullUrl += "&raided=" + raided + "&raidCount=" + raidCount
                    // console.log("5: "+fullUrl)
                }
                fullUrl += "&ref=";
                // console.log("Final: "+fullUrl)
                document.getElementById('browserURL').innerHTML = fullUrl
                navigator.clipboard.writeText(fullUrl)
                alert("Browser Overlay URL has been copied.\nPaste the URL on a Browser Source in OBS Studios.")
            }
        };

        onMounted(() => {
            fetchStreamers();
        });

        watch(filteredSearch, async () => {
            await nextTick();
            lucide.createIcons();
        });

        return {
            streamer,
            streamerList,
            submitStreamer,
            resetForm,
            formError,
            editStreamer,
            deleteStreamer,
            filteredSearch,
            filteredStreamers,
            urlGenerate
        };
    }
}).mount('#app');