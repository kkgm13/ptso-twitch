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
        submitForm() {
            let finder = this.findStreamerInFile(streamer)
            // console.log(finder)
            if( finder[0] === true){
                if(alert('Data Duplicate found for '+ JSON.stringify(json[finder[1]].streamerName) + ". Replace Data?") == true){
                    json[finder[1]].streamerName = streamer.streamerName
                    json[finder[1]].streamerDetails = streamer.streamerDetails
                    json[finder[1]].streamerColor = streamer.streamerColor
                }
            } else {
                let streamID = this.findStreamerID((streamer.streamerName).toLowerCase());
                console.log("Data Collected:" + streamID)
                // json.push(streamer)
            }
            console.log('Submitting form...');
        },
        findStreamerInRecord(streamer){ // Change json to proper Database System
            console.log('Searching for streamer:', this.streamerName);
            // Find Streamer
        }, 
        findStreamerID(streamerName) {
            // Connect to Twitch API
            // Get Streamer info via StreamerName
                // Handler needed for possible no-usernames
            // Extract and store Streamer ID
        }
    }, 
    template: '<form @reset.prevent=resetForm @submit.prevent=submitForm><div class=mb-1><h5 class=text-center>New Streamer Info</h5></div><hr><fieldset><div class="input-group mb-3"><input class=form-control v-model=streamerName aria-describedby=streamerName aria-label="Streamer Name"id=streamerName name=streamerName placeholder="Streamer Name"> <button class="btn btn-outline-primary"type=button @click=searchStreamer><i class="bi bi-search"></i></button><div class=form-text>Use the Search Button to dictate the exact unique Twitch ID, in the event of Streamer Name Changes</div></div><div class=form-floating><textarea class=form-control placeholder="Streamer Details"v-model=streamerDetails></textarea><label for=streamerDetails>Details of Streamer</label></div><div class=form-text>Please <strong>USE</strong> semicolons (;) to separate dedicated information.</div><div class="form-floating mt-2"><input class=form-control v-model=streamerColor title="Choose the Streamer Color"type=color value=#666666><label for=streamerColor class=form-label>Color Association</label></div></fieldset><hr><div class="form-group row"><div class="col-6 pt-1"><div class="d-grid gap-2"><button class="btn btn-success"type=submit>Add/Update</button></div></div><div class="col-6 pt-1"><div class="d-grid gap-2"><button class="btn btn-danger"type=reset>Clear</button></div></div></div></form>'
});
appNewStreamer.mount('#streamerForm');