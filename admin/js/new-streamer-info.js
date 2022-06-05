import json from '../streamerData.json' assert { type: "json" };
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
            // Incrementor Here
            addInfo.id = parseInt(document.getElementsByClassName('count').length ) + 1
            json.push(addInfo)  // Add ID to the number
            table.methods.saveData(json)
        },
    }
}

