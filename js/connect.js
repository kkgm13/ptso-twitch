const tmi = require('tmi.js');

const client = new tmi.Client({
	channels: [ 'channel' ]
});

client.connect();