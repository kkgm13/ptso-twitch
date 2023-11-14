import { createApp } from 'vue';
import NewStreamerForm from 'vue/NewStreamerForm.vue';
import StreamerList from 'vue/StreamerList.vue';
import URLGenerator from 'vue/URLGenerator.vue';

const newFormApp = createApp(NewStreamerForm);
newFormApp.mount('#streamerForm');
const appList = createApp(StreamerList);
appList.mount('#streamerList');
const urlGenApp = createApp(URLGenerator);
urlGenApp.createApp('#urlGenTab')