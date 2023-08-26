<template>
  <form @submit.prevent="submitForm" @reset.prevent="resetForm">
    <div class="mb-1">
      <h5 class="text-center">New Streamer Info</h5>
    </div>
    <hr>
    <input v-model="twitchID" type="hidden" id="twitchID" name="twitchID">
    <fieldset>
      <div class="input-group mb-3">
        <input v-model="streamerName" type="text" class="form-control" placeholder="Streamer Name" aria-label="Streamer Name" aria-describedby="streamerName">
        <button @click="searchStreamer" class="btn btn-outline-primary" type="button">
          <i class="bi bi-search"></i>
        </button>
        <div class="form-text">Use the Search Button to dictate the exact unique Twitch ID, in the event of Streamer Name Changes</div>
      </div>
      <div class="form-floating">
        <textarea v-model="streamerDetails" class="form-control" placeholder="Streamer Details"></textarea>
        <label for="streamerDetails">Details of Streamer</label>
      </div>
      <div class="form-text">Please <strong>USE</strong> semicolons (;) to separate dedicated information.</div>
      <div class="form-floating mt-2">
        <input v-model="streamerColor" type="color" class="form-control" title="Choose the Streamer Color" value="#666666">
        <label for="streamerColor" class="form-label">Color Association</label>
      </div>
    </fieldset>
    <hr>
    <div class="row form-group">
      <div class="col-6 pt-1">
        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-success">Add/Update</button>
        </div>
      </div>
      <div class="col-6 pt-1">
        <div class="d-grid gap-2">
          <button type="reset" class="btn btn-danger">Clear</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import axios from 'axios';

export default {
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
        },
        submitForm() {
            let finder = this.findStreamerInRecord(streamer)
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
        findStreamerInRecord(streamerName){ // Change json to proper Database System
            console.log('Searching for streamer:', this.streamerName);
            // Find Streamer
        }, 
        findStreamerID() {
            var streamSearch = (document.getElementById('streamerName').value).toLowerCase()
            console.log("Searching on Twitch for "+streamSearch)
            // Connect to Twitch API
            axios.get('https://api.twitch.tv/helix/users', {
                params: {
                    login: streamSearch
                },
            //         headers: {
            //         'Client-Id': process.env.TWITCH_CLIENT_ID,
            //         'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
                // }
            })
            .then(function (response) {
                // Get Streamer info via StreamerName
                if(!response.data){
                    // Handler needed for possible no-usernames
                    alert('No Twitch User found with that name')
                } else {
                    console.log(response.data)
                    this.streamer.twitchID = response.data.data[0].id
                    document.getElementById('twitchID').value = response.data.data[0].id            
                }
            })
            .catch(function (error) {
                console.log("ERROR - " + error);
            })
            
        }
    },
}
</script>
