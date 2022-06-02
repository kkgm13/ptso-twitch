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
            json.push(addInfo)
            table.methods.saveData(json)
        },
    }
}

