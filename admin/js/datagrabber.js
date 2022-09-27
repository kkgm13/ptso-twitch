// import json from '../testData.json' assert { type: "json" };
import json from '../streamData.json' assert { type: "json" };

export default {
    methods:{
        loadData(){
            this.items = json;
        },
    }
}