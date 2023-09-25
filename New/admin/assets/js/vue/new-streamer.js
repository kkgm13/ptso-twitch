const appNewStreamer = Vue.createApp({
    mounted() {
        console.log("Form Mounted Correctly");
    },
    data() {
        return {
            streamer: {
                twitchID: '',
                streamerName: '',
                streamerDetails: '',
                streamerColor: '#666666',
            }
        }
    },
    methods: {
        resetForm() {
            this.streamer.twitchID = '';
            this.streamer.streamerName = '';
            this.streamer.streamerDetails = '';
            this.streamer.streamerColor = '#666666';
        },
        async submitForm(streamer) {
            console.log('Submitting form...');
            // Get the Twitch ID of the Streamer
            const response = await this.findStreamerID()                
            streamer.twitchID = response.id
            //Save to a Database (MySQL or SQLite)???
            this.save2DB(streamer);
            // Reset The Form
            this.resetForm();
        },
        save2DB(streamer){
            axios.post("assets/php/db-save.php", Object.assign({}, streamer), {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(function(response){
                // Handle the successful response here
                console.log(response.data);
            })
            .catch(function (error) {
                // Handle any errors here
                console.error(error);
            });
        },
        findStreamerInRecord(streamerName){ // Change json to proper Database System
            console.log('Searching for streamer:', this.streamer.streamerName);
            // Find Streamer
        }, 
        async findStreamerID() {
            var streamSearch = (document.getElementById('streamerName').value).toLowerCase()
            console.log("Searching on Twitch for "+streamSearch)
            // Connect to Twitch API
            try{
                const response = await axios.get('https://api.twitch.tv/helix/users', {
                    params: {
                        login: streamSearch
                    },
                    headers: {
                        'Client-Id': process.env.TWITCH_CLIENT_ID,
                        'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
                    }
                })
                return response.data.data[0]
            } catch (error){
                console.log("Error: " + error)
            }
        }
    }, 
    template: '<form @reset.prevent=resetForm @submit.prevent=submitForm(streamer)><div class=mb-1><h5 class=text-center>New Streamer Info</h5></div><hr><fieldset><div class="input-group mb-3"><input class=form-control v-model=streamer.streamerName aria-describedby=streamerName aria-label="Streamer Name"id=streamerName name=streamerName placeholder="Streamer Name"></div><div class=form-floating><textarea class=form-control placeholder="Streamer Details"v-model=streamer.streamerDetails></textarea><label for=streamerDetails>Details of Streamer</label></div><div class=form-text>Please <strong>USE</strong> semicolons (;) to separate dedicated information.</div><div class="form-floating mt-2"><input class=form-control v-model=streamer.streamerColor title="Choose the Streamer Color"type=color><label for=streamerColor class=form-label>Color Association</label></div></fieldset><hr><div class="form-group row"><div class="col-6 pt-1"><div class="d-grid gap-2"><button class="btn btn-success"type=submit>Add/Update</button></div></div><div class="col-6 pt-1"><div class="d-grid gap-2"><button class="btn btn-danger"type=reset>Clear</button></div></div></div></form>'
});
appNewStreamer.mount('#streamerForm');