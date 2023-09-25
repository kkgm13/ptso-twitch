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
        console.log("Streamer List Data mounted successfully");
    },
    computed: {
        filteredStreamer() {
            const filterText = this.filteredSearch.toLowerCase();
            return this.items.filter(item => item.streamerName.toLowerCase().includes(filterText));
        },
        isDataEmpty(){
            return this.items.length === 0
        }
      },
    created() {
    },
    watch: {
        // items: {
        //     handler: this.loadData,
        //     deep: true
        // }
    },
    methods: {
        editStreamer(item) {
            alert("This is still in Beta due to complexity of internal data passing.\nBut ensure to copy/paste requried info to edit to ensure it's captured.")
        },
        deleteStreamer(item){
            if(confirm("Do you wish to delete details about "+item['streamerName']+"?") === true){
                axios.get('assets/php/db-delete.php', {
                    params: {
                        twitchID: item.twitchID
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
            // Locate 
        },
        loadData() {
            linkToPHP()
                .then(data => this.items = data);
            this.filteredSearch = "";
        },
    },
    data() {
        return {
            filteredSearch: '',
            items: this.loadData()
        }
    }, 
});
appList.mount('#streamerList');