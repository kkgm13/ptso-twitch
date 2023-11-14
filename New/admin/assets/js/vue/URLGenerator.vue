<template>
    <div class="row py-1">
        <div class="col-md-6">
            <fieldset>
                <legend>General Info</legend>
                <div class="row">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" 
                        id="mainAccount" name="mainAccount" placeholder="Streamer Channel Name"
                        aria-label="Recipient's username" aria-describedby="button-streamer">
                        <button class="btn btn-outline-secondary twitch" type="button" id="button-streamer" onclick="alert('Work In Progress')" disabled><i class="bi bi-twitch"></i></button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="input-group mb-3">
                            <span class="input-group-text">Alert Duration (sec)</span>
                            <input type="number" class="form-control" id="timeoutSize" aria-label="timeoutSize" aria-describedby="timeoutSize" step="1" min="0" value="10">
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="input-group mb-3">
                            <span class="input-group-text" >SO Delay (sec)</span>
                            <input type="number" class="form-control" aria-label="delaySize" aria-describedby="delaySize" id="delaySize" step="1" min="0" value="10">
                        </div>
                    </div>
                </div>
                
                <div class="input-group mb-1">
                    <span class="input-group-text">!</span>
                    <input type="text" class="form-control" placeholder="Custom SO Command" aria-label="commands" id="commands" aria-describedby="commands">
                    <div id="passwordHelpBlock" class="form-text">
                        Twitch's built-in shoutout command (/shoutout) is to be supported soon. (Currently In Development and Testing)
                        </div>
                </div>
            </fieldset>
        </div>
        <div class="col-md-6">
            <fieldset disabled="disabled">
                <legend>Channel Raids (Currently Unavaliable)</legend>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="isRaid" name="isRaid">
                    <label class="form-check-label" for="isRaid">
                        Activate During a Channel Raid
                    </label>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="raidNumber">Raid Size Activation</span>
                    <input type="number" class="form-control" aria-label="raidNumber" aria-describedby="raidNumber" min="0">
                </div>
            </fieldset>
        </div>
    </div>  
    <hr>              
    <div>
        <label for="browserURL" style="text-decoration: underline;">Your Browser Overlay Link: </label>
        <span class="p-1" id="browserURL"></span>
        <div class="d-grid gap-2 pt-2">
            <button class="btn btn-warning" type="button" @click="urlGenerate">Generate Overlay Link</button>
            </div>
    </div>
</template>
<script>
    export default {
        mounted(){
            console.log("URL Generator Mounted Correctly")
        },
        methods: {
            urlGenerate(){
                let fullUrl = ''
                if (!document.getElementById('mainAccount').value) {
                    alert('Your Twitch Username is not set');
                } else {
                    let timeout = document.getElementById('timeoutSize').value
                    let delay = document.getElementById('delaySize').value
                    let command = document.getElementById('commands').value
                    let raided = document.getElementById('isRaid').value
                    let raidCount = document.getElementById('raidNumber').value

                    fullUrl += window.location.protocol + "//" + window.location.host + window.location.pathname.split('admin/')[0] + "so.html?channel=" + document.getElementById('mainAccount').value.toLowerCase()+ "&showMsg=false&modsOnly=true"
                    // console.log("1: "+fullUrl)
                    if(parseInt(delay) != 0){
                        fullUrl += "&delay=" + delay
                        // console.log("2: "+fullUrl)
                    }
                    if(parseInt(timeout) != 0){
                        fullUrl += "&timeOut=" + timeout
                        // console.log("3: "+fullUrl)
                    }
                    // If other command for SO is used
                        // TODO: Figure out /shoutout ASAP
                    if(command.includes("so") || !command === ""){
                        fullUrl += "&command=" + command;
                        // console.log("4: "+fullUrl)
                    }
                    // If Channel Raiding Is considered
                    if(raided === true){
                        fullUrl += "&raided=" + raided + "&raidCount=" + raidCount
                        // console.log("5: "+fullUrl)
                    }
                    fullUrl += "&ref=";
                    // console.log("Final: "+fullUrl)
                    document.getElementById('browserURL').innerHTML = fullUrl
                    navigator.clipboard.writeText(fullUrl)
                    alert("Browser Overlay URL has been copied.\nPaste the URL on a Browser Source in OBS Studios.")
                }
            },
        }
    }
</script>