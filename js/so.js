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
    let modsOnly = getUrlParameter('modsOnly').trim();
    let command = getUrlParameter('command').trim();
    let showMsg = getUrlParameter('showMsg').trim();
    let raided = getUrlParameter('raided').trim();
    let raidCount = getUrlParameter('raidCount').trim();
    let delay = getUrlParameter('delay').trim();
    let timeOut = 8;
    let returnData = [] // Get Streamer Detail info from PTSO Admin

    if (!timeOut)   timeOut = 20;   // Default timer for TimeOut
    if (!delay)     delay = "10";   // Default timer for Delay
    let cmdAry = [];                // Blank Array for Multi-list capture
    let client = '';
    if (!command)   command = 'so'; // Default for SO commands
    if (!modsOnly)  modsOnly = 'true'; // Default for Twitch Mods only
    if (!showMsg)   showMsg = 'false';
    // Raid Consideration
    if (!raided)    raided = "false";   // If a raid has come through
    if (!raidCount) raidCount = "3";    // Raid Count limiter

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

    let checkFileInAdmin = function (file, callback){
        let folder = window.location.pathname.split("/")
        let url = window.location.origin+"/"+folder[1]+"/admin/";
        let xhrAdmin = new XMLHttpRequest();
        xhrAdmin.open('GET', url+'streamData.json', true);
        xhrAdmin.onreadystatechange = function () {
            if(xhrAdmin.readyState === 4){
                callback(xhrAdmin.responseText)
                return true
            } else { 
                return false
            }
        }
        xhrAdmin.send()
    };

    // Connect to the client
    client = new tmi.Client({
        options: {
            debug: false,
            skipUpdatingEmotesets: true
        },
        connection: {reconnect: true},
        channels: [channelName]
    });

    client.connect().catch(console.error); // Start connection to Twitch API from TMI.JS

    // Check chat for incoming Twitch chat messgaes
    client.on('chat', (channel, user, message, self) => {
        if (self){
            return false; // Ignore echoed messages.
        }

        // Ensures the first thing it detects is the "!" then the SO command
        if(message.startsWith('!'+command, 0)){ 
            // console.log("Message: "+message)
            if(document.getElementById('userMsg')){
                return false;
            }
            getChannel = message.substr(command.length+1);
            getChannel = getChannel.replace('@', '');
            // Split to grab name if anything after name is grabbed
            getChannel = getChannel.split(' ')
            getChannel = getChannel[1]
            // Trim the channel name
            getChannel = getChannel.trim();
            getChannel = getChannel.toLowerCase();
            cmdAry = message.split('@');
            cmdAry = cmdAry.slice(1);
        } else {
            // Bug if removed due to capturing any additional ! outside first string position
            return null;
        }
        // Twitch Channel Moderators ONLY Actions
        if(modsOnly === 'true' && (user.mod || user.username === channelName)){
             // If is array, then iterate over each channel name. Uses the timeOut value from the URL.
             if (cmdAry.length > 1) {
                console.log(cmdAry);
                arrayPlusDelay(cmdAry, function (sec) {
                    sec = sec.replace('@', ''); // Remove the @
                    sec = sec.trim();           // Grab Username
                    sec = sec.toLowerCase();    // Lower Case Streamer name
                    console.log(sec + 'Added in array');
                    findInAdmin(sec) // Locate if a relevant streamer in record is found
                    doShoutOut(sec); // Start Shoutout Mechanism
                }, parseInt(timeOut) * 1000 + 1000); // + 1 seconds, just to be sure that elements are completely removed
            } else {
                findInAdmin(getChannel); // Locate if a relevant streamer in record is found
                doShoutOut(getChannel); // Start Shoutout Mechanism
            }
        // ANYONE NOT A TWITCH CHANNEL MOD TO DO THIS... 
        } else {
            console.log("Unable to Shoutout!")
        }
    });

    // Reset the Data of the HTML elements by ID
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
    
    function findInAdmin(data){
        let strmName = data; // Direct Name
        checkFileInAdmin(strmName, function(info){
            var check = false;
            info = JSON.parse(info)
            Object.keys(info).forEach(function(idx){
                if(!check){
                    let dataTxt = info[idx]['streamerName']
                    if(dataTxt.toLowerCase() === strmName){
                        let x = info[idx]['streamerDetails']
                        let x2 = x.split(';').filter(Boolean)
                        returnData.push(x2)
                        // console.log("After Push: "+returnData)
                    }
                }
            })
            if(check === false){
                returnData.push(["Amazing Streamer!"]);
            }
        });
        return returnData;
    }

    function fillHTMLData(streamDetail){
        let htmldata = "<div class='slide-right-in col-8 pr-3 pl-2 holder'>"
        /**
         * CRITICAL ISSUE: Text not shifting over
         */
        // htmldata += "<div id='userMsg' class='carousel slide textshift' data-bs-ride='carousel'><div class='carousel-inner texthold'>"
        // for (let index = 0; index < streamDetail.length; index++) {
        //     if(index === 0){
        //         htmldata += "<div class='carousel-item active' data-bs-interval='500'><p>"+streamDetail[index]+"</p></div>";
        //     } else {;
        //         htmldata += "<div class='carousel-item' data-bs-interval='2000'><p>"+streamDetail[index]+"</p></div>";
        //     }
        // }
        htmldata += "<div id='userMsg' class='carousel slide textshift' data-bs-ride='carousel'><div class='carousel-inner texthold'><div class='carousel-item active' data-bs-interval='500'><p>"+streamDetail+"</p></div></div></div></div>"
        // htmldata += '</div></div>'
        return htmldata;
    }

    function doShoutOut(getChannel) {
        // Get the streamer Info based on the parameter to a new function
        getStreamerInfo(getChannel, function(info){
            if(info.data.length > 0){
                // If any HTML is found with this information, should be false
                if(document.getElementById('userMsg') || document.getElementById('streamImg')||document.getElementById('streamName')){
                   return false; 
                }
                clearData();
                let timer = 0

                // Pathway for system
                let timeStart = setInterval(function(){
                    timer++;
                    // console.log(timer); // Dev checking

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
                            getChannel = ""
                        }, 500);
                    }
                }, 1000);

                let streamName  = info.data[0]['display_name'];
                let streamImg   = info.data[0]['profile_image_url'];
                let streamDetail = Object.values(returnData[0]) 
                streamDetail = fillHTMLData(streamDetail)

                // Append HTML Data with the main info to SO Container
                $("<div class='row'><div id='streamName' class='col-12 slide-left-in'><h1>Check out: "+ streamName +"</h1></div></div>").appendTo('#container')
                //Needs to merge tother as for some reason div count is a pain (Div internal required to )
                $("<div class='row'><div class='col-4'><div class='pl-3 pr-2 text-center' id='streamImg'><img class='image img-fluid fade-in-image' id='strmAvtr' src='"+streamImg+"' alt='Twitch User'></div></div>"+streamDetail+"</div>").appendTo("#container");
                returnData = []
            } else {
                // If streamer is non-existant
                console.log (getChannel + " where exactly?!")
                return false;
            }
        });
    }
});