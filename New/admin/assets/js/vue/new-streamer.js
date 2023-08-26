const appNewStreamer = Vue.createApp({
    mounted() {
        console.log("Form Mounted Correctly");
    },
    data() {
        return {
            streamer: {
                twitchID: '', // Check how to store ASAP
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
            document.getElementById('streamerName').removeAttribute("readonly","readonly")
        },
        async submitForm(streamer) {
            // let finder = this.findStreamerInRecord(streamer)
            // console.log(finder)
            // if( finder[0] === true){
            //     if(alert('Data Duplicate found for '+ JSON.stringify(json[finder[1]].streamerName) + ". Replace Data?") == true){
            //         json[finder[1]].streamerName = streamer.streamerName
            //         json[finder[1]].streamerDetails = streamer.streamerDetails
            //         json[finder[1]].streamerColor = streamer.streamerColor
            //     }
            // } else {
                // let streamID = this.findStreamerID((streamer.streamerName).toLowerCase());
                // console.log("Data Collected:" + streamID)
                // json.push(streamer)
                const id = await this.findStreamerID()
                this.streamer.twitchID = id
                console.log(this.streamer.target)
            // }
            // console.log('Submitting form...');
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
                return response.data.data[0].id
            } catch (error){
                console.log(error)
            }
        }
    }, 
    template: '<form @reset.prevent=resetForm @submit.prevent=submitForm(streamer)><div class=mb-1><h5 class=text-center>New Streamer Info</h5></div><hr><fieldset><div class="input-group mb-3"><input class=form-control v-model=streamer.streamerName aria-describedby=streamerName aria-label="Streamer Name"id=streamerName name=streamerName placeholder="Streamer Name"></div><div class=form-floating><textarea class=form-control placeholder="Streamer Details"v-model=streamer.streamerDetails></textarea><label for=streamerDetails>Details of Streamer</label></div><div class=form-text>Please <strong>USE</strong> semicolons (;) to separate dedicated information.</div><div class="form-floating mt-2"><input class=form-control v-model=streamer.streamerColor title="Choose the Streamer Color"type=color><label for=streamerColor class=form-label>Color Association</label></div></fieldset><hr><div class="form-group row"><div class="col-6 pt-1"><div class="d-grid gap-2"><button class="btn btn-success"type=submit>Add/Update</button></div></div><div class="col-6 pt-1"><div class="d-grid gap-2"><button class="btn btn-danger"type=reset>Clear</button></div></div></div></form>'
});
appNewStreamer.mount('#streamerForm');