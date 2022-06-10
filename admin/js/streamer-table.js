// import json from '../testData.json' assert { type: "json" };
import json from '../streamData.json' assert { type: "json" };

export default {
    mounted(){
        console.log("Table Data mounted successfully")
    },
    created(){
        this.loadData()
    },
    methods: {
        edit(item) {
            alert("This is still in Beta due to complexity of internal data passing.\nBut ensure to copy/paste requried info to edit to ensure it's captured.")
            document.getElementById('streamerName').value = item.streamerName;
            document.getElementById('streamerDetails').value = item.streamerDetails;
        },
        deleteStreamer(item){
            // alert('Derp, im supposed to work');
            if(confirm("Do you wish to delete details about "+item['streamerName']+"?") === true){
            var lstTxt = item['streamerName']
            console.log("Old List"+JSON.stringify(json))
            json.forEach(function(value,idx){
                console.log(value)
                let dataTxt = value['streamerName']
                if(dataTxt.toLowerCase() === lstTxt.toLowerCase()){
                    json.splice(idx,1)
                }
            })
            this.saveData(json)
            }
        },
        loadData(){
            this.items = json;
        },
        saveData(items) {
            function download(content, fileName, contentType) {
                var a = document.createElement("a");
                var file = new Blob([content], {type: contentType});
                // New Save
                alert("This is not fully automated... Please save JSON file inside the \"ptso-twitch/admin\" folder for it to continue working.")
                a.href = URL.createObjectURL(file);
                a.download = fileName;
                a.click();
                // Required for autoloading info again
                if(alert("Save Complete")){
                    location.reload();
                } else {
                    location.reload();
                }  
            }
            // Fix Absolute path to keep file synergy
            download(JSON.stringify(items, null, 2), 'streamData.json', 'application/json');
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