import json from '../testData.json' assert { type: "json" };

export default {
    mounted(){
        this.loadData()
        console.log("Table Data mounted successfully")
    },
    methods: {
        edit(item) {
            document.getElementById('streamerInput').value = item.streamerName;
            document.getElementById('streamerDetails').value = item.streamerDetails;
        },
        deleteStreamer(item){
            alert('Derp, im supposed to work');
            console.log(item)
        },
        loadData(){
            json.forEach(x => {
                console.log(x)
            });
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
            // Requires a full local File I/O
            items: [
                { id: 1, streamerName:'kkgm13', streamerDetails: 'Test1;Test2:test3;test4'},
                { id: 2, streamerName:'farahino', streamerDetails: 'Test1;Test2:test3;test4'},
                { id: 3, streamerName:'diamondzbeard',streamerDetails: 'Test1;Test2:test3;test4'},
            ]
        }
    }
}