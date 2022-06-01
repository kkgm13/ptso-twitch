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
    let useClips = getUrlParameter('useClips').trim();
    let command = getUrlParameter('command').trim();
    let ref = getUrlParameter('ref').trim();
    let showMsg = getUrlParameter('showMsg').trim();
    let raided = getUrlParameter('raided').trim();
    let raidCount = getUrlParameter('raidCount').trim();
    let delay = getUrlParameter('delay').trim();

    if (!raided)    raided = "false"; //default

    if (!raidCount) raidCount = "3"; //default

    if (!delay)     delay = "10"; //default

    let cmdArray = [];

    let client = '';

    if (!command)   command = 'so'; // default

    if (!timeOut)   timeOut = 20; // default

    if (!useClips)  useClips = 'false'; // default

    if (!modsOnly)  modsOnly = 'true'; // default

    if (!showMsg)   showMsg = 'false'; // default

    // Twitch API get user info for !so command
    let getStreamerInfo = function (SOChannel, callback) {
        let url = "https://twitchapi.teklynk.com/getuserinfo.php?channel=" + SOChannel;
        let xhr = new XMLHttpRequest();
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

    // Twitch API get last game played from a user
    let getStatus = function (SOChannel, callback) {
        let url = "https://twitchapi.teklynk.com/getuserstatus.php?channel=" + SOChannel + "";
        let xhrG = new XMLHttpRequest();
        xhrG.open("GET", urlG);
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

    client.connect().catch(console.error);

    client.on('chat', (channel, user, message, self) => {
        // Ignore echoed messages.
        if (self) return false;

        if(message.startsWith('!'+command) && (modsOnly === 'true' && (user.mod || user.username === channelName))){
             // If is array, then iterate over each channel name. Uses the timeOut value from the URL.
             if (cmdArray.length > 1) {
                console.log(cmdArray);
                arrayPlusDelay(cmdArray, function (obj) {
                    obj = obj.replace('@', '');
                    obj = obj.trim();
                    obj = obj.toLowerCase();
                    console.log('In Array: ' + obj);
                    
                    doShoutOutSlider(obj);
                }, parseInt(timeOut) * 1000 + 1000); // + 1 seconds, just to be sure that elements are completely removed
            } else {
                console.log(getChannel);
                doShoutOutSlider(getChannel); // Mods only
            }
            // Mods only
        } else if (modsOnly === 'false' || user.username === channelName) {
            doShoutOutSlider(getChannel); // Everyone
        }
    });

});