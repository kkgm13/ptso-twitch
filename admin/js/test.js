const axios = require('axios').default;

axios.get('https://twitchapi.teklynk.com/getuserinfo.php',{
    params: {
        channel: "kkgm13"
    }
}).then(function (response){
    console.log("Data Grabbed", response)
}).catch(function (error){
    console.log('Error', error.message)
    console.log('Error', error.request)
});