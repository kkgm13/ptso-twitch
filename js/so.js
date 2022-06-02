$(document).ready(function(){

    // Get values from URL string
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    function arrayPlusDelay(array, delegate, delay) {
        // initialize all calls right away
        array.forEach(function (el, i) {
            setTimeout(function () {
                // each loop, call passed in function
                delegate(array[i]);

                // stagger the timeout for each loop by the index
            }, i * delay);
        })
    }

    let getChannel;
    let channelName = getUrlParameter('channel').toLowerCase();
    let channelMessage = getUrlParameter('msg').trim();
    let timeOut = getUrlParameter('timeOut').trim();
    let modsOnly = getUrlParameter('modsOnly').trim();
    let command = getUrlParameter('command').trim();
    let showMsg = getUrlParameter('showMsg').trim();
    let raided = getUrlParameter('raided').trim();
    let raidCount = getUrlParameter('raidCount').trim();
    let delay = getUrlParameter('delay').trim();

    if (!raided)    raided = "false"; //default

    if (!raidCount) raidCount = "3"; //default

    if (!delay)     delay = "10"; //default

    let cmdAry = []; // Blank Array for capture

    let client = '';

    if (!command)   command = 'so'; // default

    if (!timeOut)   timeOut = 20; // default

    if (!modsOnly)  modsOnly = 'true'; // default

    if (!showMsg)   showMsg = 'false'; // default

    // Twitch API get user info for !so command
    let getStreamerInfo = function (channel, callback) {
        // Main URL
        let url = "https://twitchapi.teklynk.com/getuserinfo.php?channel=" + channel; 
        let xhr = new XMLHttpRequest(); +
        xhr.open("GET", url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(JSON.parse(xhr.responseText));
                return true;
            } else {
                return false;
            }
        };
        xhr.send();
    };

    // Twitch API get last game played from a Streamer
    let getGame = function (channel, callback) {
        let url = "https://twitchapi.teklynk.com/getuserstatus.php?channel=" + channel + "";
        let xhrG = new XMLHttpRequest();
        xhrG.open("GET", url);
        xhrG.onreadystatechange = function () {
            if (xhrG.readyState === 4) {
                callback(JSON.parse(xhrG.responseText));
                return true;
            } else {
                return false;
            }
        };
        xhrG.send();
    };

    // Connect to the client
    client = new tmi.Client({
        options: {
            debug: true,
            skipUpdatingEmotesets: true
        },
        connection: {reconnect: true},
        channels: [channelName]
    });

    client.connect().catch(console.error); // Start connection to Twitch API from TMI.JS

    // Check chat for messages coming through
    client.on('chat', (channel, user, message, self) => {
        if (self){
            return false; // Ignore echoed messages.
        }

        if(message.startsWith('!'+command, 0)){
            if(document.getElementById('userMsg')){
                return false;
            }
            getChannel = message.substr(command.length+1);
            console.log("Direct:" + getChannel)
            getChannel = getChannel.replace('@', '');
            // Trim the channel name
            getChannel = getChannel.trim();
            getChannel = getChannel.toLowerCase();
            console.log("Converted: "+getChannel)
            cmdAry = message.split('@');
            cmdAry = cmdAry.slice(1);
        } else {
            // Bug if removed due to capturing any additional ! outside first string position
            return null;
        }

        if(modsOnly === 'true' && (user.mod || user.username === channelName)){
             // If is array, then iterate over each channel name. Uses the timeOut value from the URL.
             if (cmdAry.length > 1) {
                console.log(cmdAry);
                arrayPlusDelay(cmdAry, function (sec) {
                    sec = sec.replace('@', ''); // Remove the @
                    sec = sec.trim();           // Grab Username
                    sec = sec.toLowerCase();    // Lower Case Streamer name
                    console.log(sec + 'Added in array');
                    
                    doShoutOut(sec); // Start Shoutout Mechanism
                }, parseInt(timeOut) * 1000 + 1000); // + 1 seconds, just to be sure that elements are completely removed
            } else {
                console.log(getChannel);
                // Validate whats should happen here
                doShoutOut(getChannel); // Start Shoutout Mechanism
            }
            // Mods only
        } else if (modsOnly === 'false' || user.username === channelName) {
            doShoutOut(getChannel); // Everyone
        }
    });

    function clearData(){
        if(document.getElementById('userMsg')){
            document.getElementById('userMsg').remove();
        }
        if(document.getElementById('streamImg')){
            document.getElementById('streamImg').remove();
        }
        if(document.getElementById('streamName')){
            document.getElementById('streamName').remove();
        }
    }

    function doShoutOut(getChannel) {
        getStreamerInfo(getChannel, function(info){
            if(info.data.length > 0){

                if(document.getElementById('userMsg') || document.getElementById('streamImg')||document.getElementById('streamName')){
                   return false; 
                }

                clearData(); // Clear Data

                let timer = 0; // Start SO idle Timer
                // Pathway for system
                let timeStart = setInterval(function(){
                    timer++;

                    console.log(timer);

                    // If no clips are used AND timer is on timeout with the userMsg
                    if(timer == parseInt(timeOut) && document.getElementById("userMsg")){
                        // INSERT ANIMATION AND TEXT USAGES
                        if (document.getElementById("userMsg")) {
                            document.getElementById("userMsg").classList.remove("slide-left-in");
                        }
                        if (document.getElementById("streamImg")) {
                            document.getElementById("streamImg").getElementsByClassName("image")[0].classList.remove("fade-in-image");
                        }
                        if (document.getElementById("streamName")) {
                            document.getElementById("streamName").classList.remove("slide-right-in");
                        }

                        // Slide out animation
                        if (document.getElementById("userMsg")) {
                            document.getElementById("userMsg").classList.add("slide-right-out");
                        }
                        if (document.getElementById("streamImg")) {
                            document.getElementById("streamImg").getElementsByClassName("image")[0].classList.add("fade-out-image");
                        }
                        if (document.getElementById("streamName")) {
                            document.getElementById("streamName").classList.add("slide-left-out");
                        }                       
                        // Clear Timeout
                        setTimeout(function(){
                            clearData();
                            timer = 0;
                            clearInterval(timeStart);
                            // Data Remover for HTML Body cleaning
                            document.getElementById('container').innerHTML="";
                            getChannel = "" // Nuller
                        }, 500);
                    }
                }, 1000);
                let streamName  = info.data[0]['display_name'];         // Streamer Name
                let streamImg   = info.data[0]['profile_image_url'];    // Streamer Image
                let userMsg     = decodeURI(channelMessage);

                // Append HTML Data with the main info to SO Container
                $("<div class='row'><div id='streamName' class='col-12 slide-left-in'><h1>Check out: "+ streamName +"</h1></div></div>").appendTo('#container')
                //Needs to merge tother as for some reason div count is a pain (Div internal required to )
                $("<div class='row'><div class='col-3'><div class='pl-3 pr-2 text-center' id='streamImg'><img class='image img-fluid fade-in-image' id='strmAvtr' src='"+streamImg+"' alt='Twitch User'></div></div><div class='slide-right-in col-9'><div id='userMsg' class='holder pr-3 pl-2'><p class='p-1 rounded'>Lorem, ipsum dolor sit amet consectetur."+userMsg+"</p></div></div></div>").appendTo("#container");
            } else {
                // If streamer is non-existant
                console.log (getChannel + " where exactly?!")
                return false;
            }
        });
    }
});