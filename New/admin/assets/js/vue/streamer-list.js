const appList = Vue.createApp({
    mounted(){
        console.log("Streamer List Data mounted successfully")
    },
    created() {
        // Data Fetcher Handler here
    },
    methods: {
        editStreamer(item) {
            alert("This is still in Beta due to complexity of internal data passing.\nBut ensure to copy/paste requried info to edit to ensure it's captured.")
        },
        deleteStreamer(item){
            if(confirm("Do you wish to delete details about "+item['streamerName']+"?") === true){
                //Get Streamer Details
                //Delete Streamer from list
                // Save via saveData()
            }
        },
        saveData() {
            // Save Data
            // Reload Data
        }
    },
    data() {
        return {
            fields: [
                {
                    key: 'streamerID',
                    label: '#'
                },
                {
                    key: 'streamerName',
                    label: 'Streamer Name'
                },
                {
                    key: 'streamerDetails',
                    label: 'Details about Streamer'
                },
                {
                    key: 'streamerColor',
                    label: 'Associated Streamer Color'
                }
            ],
            items: null
        }
    }
});
appList.mount('#streamerList');