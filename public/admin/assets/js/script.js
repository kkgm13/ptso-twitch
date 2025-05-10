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

        const submitStreamer = async () => {
            console.log(streamer)
            formError.value = '';
            try {
                // console.log('HIT')    
                // return fetch('http://localhost:3030/api/streamer?username=${encodeURIComponent(username)}')
                // .then(res => res.json())
                // .then(data => console.log('Twitch ID:', data.twitchId))
                // .catch(err => console.error('Vue Fetch Error:', err));

                const res = await fetch(`/api/streamer?username=${encodeURIComponent(streamer.streamerName)}`);
                console.log('SUCCESS')
                // if (!res.ok) {
                //     const errorData = await res.json();
                //     throw new Error(errorData.error || 'Unknown error');
                // }
                // const data = await res.json();
                // return data.twitchId;
            
                // if (!response.ok) {
                //     const errorData = await response.json();
                //     throw new Error(errorData.error || 'Failed to fetch Twitch user');
                // }
            
                // const { twitchId } = await response.json();
                // streamer.twitchId = twitchId;
            
                // // Handle insert or update
                // if (streamer.id) {
                //     const index = streamerList.findIndex(s => s.id === streamer.id);
                //     if (index !== -1) {
                //         streamerList[index] = { ...streamer };
                //     }
                // } else {
                //     streamerList.push({ ...streamer, id: Date.now() });
                // }
            
                // resetForm();
                // console.log('Streamer saved successfully');
            
            
            // streamer.twitchId = twitchId;
            
            // if (streamer.id) {
                //     const index = streamerList.findIndex(s => s.id === streamer.id);
                //     if (index !== -1) {
                    //         streamerList[index] = { ...streamer };
                    //     }
                    // } else {
                        //     streamerList.push({ ...streamer, id: Date.now() });
                        // }
                        // resetForm();
            } catch (err) {
                console.error('Submit error:', err.message);
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