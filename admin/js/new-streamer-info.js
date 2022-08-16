import json from '../streamData.json' assert { type: "json" };
import table from '../js/streamer-table.js';
// import locateStreamer from '../../js/so.js';
import sanitizeHtml from '../node_modules/sanitize-html/index.js';
// const sanitizeHtml = require('sanitize-html');

export default {
    mounted(){
        console.log("Form Mounted Correctly");
    },
    data() {
        return {
            addInfo: {
                id: '', // Duplicate ID's found
                streamerName: '',
                streamerDetails: '',
                streamerColor: '#666666',
            }
        }
    },
    methods: {
        saveInfo(addInfo) {
            let finder = this.findStreamerInFile(addInfo, json)
            // console.log(finder)
            if( finder[0] === true){
                if(alert('Data Duplicate found for '+ JSON.stringify(json[finder[1]].streamerName) + ". Replace Data?") == true){
                    json[finder[1]].streamerName = addInfo.streamerName
                    json[finder[1]].streamerDetails = addInfo.streamerDetails
                    json[finder[1]].streamerColor = addInfo.streamerColor
                }
            } else {
                let streamID = this.getStreamID((addInfo.streamerName).toLowerCase());
                // console.log("Data Collected:" + streamID)
                addInfo.id = parseInt(document.getElementsByClassName('count').length ) + 1
                const text = addInfo.streamerDetails
                console.log(addInfo.streamerDetails)
                console.log(sanitizeHtml(addInfo.streamerDetails))
                // json.push(addInfo)
            }
            // table.methods.saveData(json)
        },
        findStreamerInFile(addInfo, json){
            var check = false;
            var index = 0;
            Object.keys(json).forEach(function(idx){
                if(!check){
                    let dataTxt = json[idx]['streamerName']
                    let formTxt = addInfo.streamerName
                    if(dataTxt.toLowerCase() === formTxt.toLowerCase()){
                        // console.log('Data Check: ' + (json[idx]['streamerName'] === addInfo.streamerName))
                        check = true
                        index = idx
                    }
                }
            })
            return [check, index]
        }, 
        getStreamID(streamerName) {
            if(streamerName != "") {
                axios.get('https://twitchapi.teklynk.com/getuserinfo.php',{
                    headers: {'X-Requested-With': 'XMLHttpRequest'},
                    params: {
                        channel: streamerName
                    },
                    responseType: 'json'
                }).then(function (response){
                    console.log("Data Grabbed", response)
                }).catch(function (error){
                    console.log('Error', error.message)
                    console.log('Error', error.request)
                })
            } else {
                console.log("WTF")
            }
             //https://stackoverflow.com/questions/59340977/how-to-write-this-xhr-request-in-axios

            // let url = "https://twitchapi.teklynk.com/getuserinfo.php?channel=" + streamerName; 
            // let xhr = new XMLHttpRequest(); +
            // xhr.open("GET", url);
            // xhr.onreadystatechange = function () {
            //     if (xhr.readyState === 4) {
            //         callback(JSON.parse(xhr.responseText));
            //         return true;
            //     } else {
            //         return false;
            //     }
            // };
            // xhr.send();

            // console.log(xhr)
        }

        // let getStreamerInfo = function (channel, callback) {
        //     // Main URL
        //     let url = "https://twitchapi.teklynk.com/getuserinfo.php?channel=" + channel; 
        //     let xhr = new XMLHttpRequest(); +
        //     xhr.open("GET", url);
        //     xhr.onreadystatechange = function () {
        //         if (xhr.readyState === 4) {
        //             callback(JSON.parse(xhr.responseText));
        //             return true;
        //         } else {
        //             return false;
        //         }
        //     };
        //     xhr.send();
        // };
    }
}

