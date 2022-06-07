import json from '../streamData.json' assert { type: "json" };
import table from '../js/streamer-table.js';

export default {
    mounted(){
        console.log("Form Mounted Correctly");
    },
    data() {
        return {
            addInfo: {
                id: '', // ?????
                streamerName: '',
                streamerDetails: '',
            }
        }
    },
    methods: {
        saveInfo(addInfo) {
            let finder = this.findStreamerInFile(addInfo, json)
            console.log(finder)
            if( finder[0]=== true){
                if(confirm('Data Duplicate found for '+ JSON.stringify(json[finder[1]].streamerName) + ". Replace Data?") == true){
                    json[finder[1]].streamerDetails = addInfo.streamerDetails
                    table.methods.saveData()
                }
            } else {
                addInfo.id = parseInt(document.getElementsByClassName('count').length ) + 1
                json.push(addInfo)  // Add ID to the number
                table.methods.saveData(json)
            }
        },
        findStreamerInFile(addInfo, json){
            var check = false;
            var index = 0;
            Object.keys(json).forEach(function(idx){
                if(!check){
                    if(json[idx]['streamerName'] === addInfo.streamerName){
                        console.log('Data Check: ' + (json[idx]['streamerName'] === addInfo.streamerName))
                        check = true
                        index = idx
                    }else {
                        console.log("Nope")
                    }
                }
            })
            return [check, index]
        }
    }
}

