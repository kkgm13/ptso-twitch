export default {
    mounted(){
        console.log("Table Data mounted successfully")
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