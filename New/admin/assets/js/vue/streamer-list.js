function linkToPHP(){
   return axios.get('assets/php/db-get.php', {
            params: {
                type: 'all'
            },
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.data.data)
        .catch(function (error) {
            console.error(error);
        });
}

const appList = Vue.createApp({
    mounted(){
        this.loadData();
        console.log("Streamer List Data mounted successfully");
    },
    computed: {
        filteredStreamer() {
            return this.items.filter(item => 
                item.streamerName.toLowerCase().includes(this.filteredSearch.toLowerCase())
            );
        },
        isDataEmpty(){
            return this.items.length === 0
        }
    },
    methods: {
        editStreamer(item) {
            alert("This is still in Beta due to complexity of internal data passing.\nBut ensure to copy/paste requried info to edit to ensure it's captured.")
        },
        deleteStreamer(item){
            if(confirm("Do you wish to delete details about "+item['streamerName']+"?") === true){
                axios.get('assets/php/db-delete.php', {
                    params: {
                        twitchID: item.twitchID,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
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
            // // Locate
            // axios.get('assets/php/db-get.php', {
            //     params: {
            //         twitchID: item.twitchID,
            //         type: 'single'
            //     },
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // })
            // .then(function(response){
            //     console.log(response)
            // })
            // .catch(function(error){
            //     console.error(error)
            // });
        },
        loadData(){
            this.filteredSearch = "";
            return linkToPHP()
                .then(data => {
                    this.items = data;
                    return data; 
                });
        },
    },
    data() {
        return {
            filteredSearch: '',
            items: []
        }
    }, 
});
appList.mount('#streamerList');