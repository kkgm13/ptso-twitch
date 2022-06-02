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
        saveInfo() {
            // Incrementor Here
            json.push(this.addInfo)
            console.log(JSON.stringify(json[0]))
            alert('Hello World');
            // table.methods.loadData()
            
        }
    }
}

