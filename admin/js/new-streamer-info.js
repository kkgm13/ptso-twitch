import json from '../streamerData.json' assert { type: "json" };

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
            console.log(this.addInfo)
            alert('Hello World');
            
        }
    }
}

