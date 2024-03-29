const appURL = Vue.createApp({
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
});
appURL.mount('#urlGenTab');