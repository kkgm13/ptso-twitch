import json from '../streamData.json' assert { type: "json" };
import table from '../js/streamer-table.js';

export default {
    mounted(){
        console.log("Form Mounted Correctly");
    },
    data() {
        return {
            addInfo: {
                id: '', // Duplicate ID's found
                streamerName: null,
                streamerDetails: null,
            }
        }
    },
    methods: {
        saveInfo(addInfo) {
            let finder = this.findStreamerInFile(addInfo, json)
            // console.log(finder)
            if( finder[0]=== true){
                if(alert('Data Duplicate found for '+ JSON.stringify(json[finder[1]].streamerName) + ". Replace Data?") == true){
                    json[finder[1]].streamerName = addInfo.streamerName
                    json[finder[1]].streamerDetails = addInfo.streamerDetails
                }
            } else {
                addInfo.id = parseInt(document.getElementsByClassName('count').length ) + 1
                json.push(addInfo)
                console.log(addInfo)
            }
            table.methods.saveData(json)
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
                    } else {
                        console.log("Nope")
                    }
                }
            })
            return [check, index]
        }
    }
}

