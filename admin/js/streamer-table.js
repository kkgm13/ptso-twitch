import json from '../testData.json' assert { type: "json" };
// import json2 from '../streamerData.json' assert { type: "json" };

export default {
    mounted(){
        console.log("Table Data mounted successfully")
    },
    created(){
        this.loadData()
    },
    methods: {
        edit(item) {
            document.getElementById('streamerName').value = item.streamerName;
            document.getElementById('streamerDetails').value = item.streamerDetails;
        },
        deleteStreamer(item){
            alert('Derp, im supposed to work');
            console.log(item)
        },
        loadData(){
            // this.items = json2;
            this.items = json;
        },
        saveData(items) {
            function download(content, fileName, contentType) {
                var a = document.createElement("a");
                var file = new Blob([content], {type: contentType});
                alert("This is not fully complete... Please save JSON file inside the ptso-twitch/admin folder for it to continue working.")
                a.href = URL.createObjectURL(file);
                a.download = fileName;
                a.click();
                alert("Save Complete")
                this.loadData()
            }
            // Fix Absolute path to keep file synergy
            download(JSON.stringify(items, null, 2), 'streamerData.json', 'application/json');
        }
    },
    data() {
        return {
            fields: [
                {
                    key: 'id',
                    label: '#'
                },
                {
                    key: 'streamerName',
                    label:'Streamer Name'
                },
                {
                    key: 'streamerDetails',
                    label: 'Details about Streamer'
                }
            ], 
            items: null
        }
    }
}