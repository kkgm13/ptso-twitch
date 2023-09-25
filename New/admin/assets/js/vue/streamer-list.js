function linkToPHP(){
   return axios.get('assets/php/db-get.php', {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.data.data)
            .catch(function (error) {
                // Handle any errors here
                console.error(error);
            });
}
const appList = Vue.createApp({
    mounted(){
        this.loadData()
        console.log("Streamer List Data mounted successfully");
    },
    created() {
        this.loadData()
    },
    methods: {
        editStreamer(item) {
            alert("This is still in Beta due to complexity of internal data passing.\nBut ensure to copy/paste requried info to edit to ensure it's captured.")
        },
        deleteStreamer(item){
            if(confirm("Do you wish to delete details about "+item['streamerName']+"?") === true){
                //Delete Streamer from Data list
                axios.get('assets/php/db-delete.php', {
                    params: {
                        twitchID: item.twitchID
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    }})
                    .then(function(response){
                        console.log(response.data.message)
                    })
                    .catch(function(error){
                        console.error(error)
                    });
                this.loadData();
            }
        },
        getStreamer(item){
            // Locate 
        },
        loadData() {
            linkToPHP()
                .then(data => this.items = data);
        },
        resetForm() {
            this.streamerName = '';
            this.streamerDetails = '';
            this.streamerColor = '#666666';
          }
    },
    data() {
        return {
            items: []
        }
    }, 
});
appList.mount('#streamerList');