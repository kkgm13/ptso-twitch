# Updated Personalized Textual Shoutout Overlay for Twitch (PTSO)


*A Localized and Self-Hosted Twitch Shoutout Overlay system for Twitch Streamers, with personalized streamer-tailored text about a specified streamer via ADMIN section. Overlay trigger is accessible to Twitch Moderators and Channel Streamer only. Using the new Twitch Helix API system.*

## Prerequisites❗
- A LocalHost system running (LAMP/WAMP Stack)
- [NodeJS](https://nodejs.org/en/download) (MacOS use [Homebrew](https://brew.sh)!) & [NodeJS Package Manager](https://npmjs.com)
    - Specifically For ```npm run setup```
- [OBS Studio](https://obsproject.com) (Will work with StreamLabs [BUT Not Recommended])
    - Ensure Twitch Account is connected and Linked! 
### Example usage:
- [MAMP](https://www.mamp.info/)
    - If utilizing MAMP, ensure MAMP's Document Root folder calling a folder above this system (eg: DocRootFolder/ptso-twitch/)
- [XAMPP](https://www.apachefriends.org/download.html)
    - If utilizing XAMPP, ensure the ptso-twitch folder is stored in the htdocs folder inside XAMPP.    
## PTSO Dependencies 🤝
- [Twitch Helix API](https://dev.twitch.tv/docs/api/)
- [VueJS](https://vuejs.org)
- [Axios-HTTP](http://axios-http.com)
- [dotenv](https://www.npmjs.com/package/dotenv) (TBD)
- [Santatize-HTMl] (TBC)

## First Time Running
0) Login to [Twitch Dev](https://dev.twitch.tv) and get your Client ID & Client Secret after creating your own Localhost Application
1) After running ```npm update``` on a Command Prompt/Terminal to start up dependencies, run ```npm run setup``` to get your information and Access Token. Some of these will need your specific Register App details via Twitch Dev
    - *Note: There maybe a scenario that you will need to rerun```npm run setup``` now and then if not working correctly.*

## Notes 📝
1) Please ensure to clear OBS Browser cache **before and after** stream for safety, especially with extensive data work with Admin Section
3) To have unique lines for a streamer, load up the localhost server and checkout the Admin page on a browser to add unique statements about them.

## 🛠️ Future Updates to Fix
|Task| Critcality |
|------|-------|
|SO.html: Single Line Carousel during activation| **CRITICAL FEATURE** | 
|📌 Admin: Twitch API Integration |In Progress|
|⭐️ System: Use Twitch ID instead as a reference system due to potential username changes over time|Final Testings|
|Admin: Automatic Front-end Saving|Mid|
|Admin: Proper Database Calling via MongoDB/MySQL/SQLite|Mid|
|Admin?: User Customization under request of some Twitch Streamers (eg: Box Color, Font Family, etc...)|In progress|
|Kick Streaming Implementation???? |???|