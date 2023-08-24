const appNewStreamer = Vue.createApp({
    mounted() {
        console.log("Form Mounted Correctly");
    },
    data() {
        return {
            addInfo: {
                twitchID: '', // Check how to store ASAP
                streamerName: '',
                streamerDetails: '',
                streamerColor: '',
            }
        }
    },
    methods: {
        submitForm() {
            let finder = this.findStreamerInFile(addInfo)
            // console.log(finder)
            if( finder[0] === true){
                if(alert('Data Duplicate found for '+ JSON.stringify(json[finder[1]].streamerName) + ". Replace Data?") == true){
                    json[finder[1]].streamerName = addInfo.streamerName
                    json[finder[1]].streamerDetails = addInfo.streamerDetails
                    json[finder[1]].streamerColor = addInfo.streamerColor
                }
            } else {
                let streamID = this.findStreamerID((addInfo.streamerName).toLowerCase());
                console.log("Data Collected:" + streamID)
                // json.push(addInfo)
            }
            console.log('Submitting form...');
        },
        findStreamerInRecord(addInfo){ // Change json to proper Database System
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
    template: '<form action="#" method="post"><div class="mb-1"><h5 class="text-center">New Streamer Info</h5></div><hr><fieldset><div class="input-group mb-3"><input type="text" class="form-control" placeholder="Streamer Name" aria-label="Streamer Name" aria-describedby="streamerName" id="streamerName" name="streamerName"><button class="btn btn-outline-primary " type="button" id="streamerName"><i class="bi bi-search"></i></button><div class="form-text" id="streamerName">Use the Search Button to dictate the exact unique Twitch ID, in the event of Streamer Name Changes</div></div><div class="form-floating"><textarea class="form-control" placeholder="Streamer Details" name="streamerDetails" id="streamerDetails"></textarea><label for="streamerDetails">Details of Streamer</label></div><div id="streamerDetails" class="form-text">Please <strong>USE</strong> semicolons (;) to separate dedicated information.</div><div class="form-floating mt-2"><input type="color" class="form-control " id="streamerColor" name="streamerColor" title="Choose the Streamer Color" value="#666666"><label for="streamerColor" class="form-label">Color Association</label></div></fieldset><hr><div class="row form-group"><div class="col-6 pt-1"><div class="d-grid gap-2"><input type="submit" value="Add/Update" class="btn btn-success"></div></div><div class="col-6 pt-1"><div class="d-grid gap-2"><input type="reset" value="Clear" class="btn btn-danger"></div></div></div></form>'
});
appNewStreamer.mount('#streamerForm');