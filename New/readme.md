# Updated Personalized Textual Shoutout Overlay for Twitch (PTSO)


*A Localized and Self-Hosted Twitch Shoutout Overlay system for Twitch Streamers, with personalized streamer-tailored text about a specified streamer via ADMIN section. Overlay trigger is accessible to Twitch Moderators and Channel Streamer only. Using the new Twitch Helix API system.*

## Prerequisites❗
- A LocalHost system running (LAMP/WAMP Stack)
- [NodeJS](https://nodejs.org/en/download) (MacOS use [Homebrew](https://brew.sh)!) & [NodeJS Package Manager](https://npmjs.com)
    - Specifically For ```npm run setup```
- [OBS Studio](https://obsproject.com) (Will work with StreamLabs [BUT Not Recommended])
    - Ensure Twitch Account is connected and linked! 
### Example usage:
- [MAMP](https://www.mamp.info/)
    - If utilizing MAMP, ensure MAMP's Document Root folder calling a folder above this system (eg: DocRootFolder/ptso-twitch/)
- [XAMPP](https://www.apachefriends.org/download.html)
    - If utilizing XAMPP, ensure the ptso-twitch folder is stored in the htdocs folder inside XAMPP.    
## PTSO Dependencies 🤝
- [Twitch Helix API](https://dev.twitch.tv/docs/api/)
- [VueJS](https://vuejs.org)
- [Axios-HTTP](http://axios-http.com)

## First Time Running
0) ❗️Login to [Twitch Dev](https://dev.twitch.tv) and get your Client ID & Client Secret after creating your own Localhost Application
### If with knowledge with Terminals/Command Prompt
1) Run ```npm update``` on a Command Prompt/Terminal to start up dependencies
    - Must be done to link/update internal dependencies
2) Run ```npm run setup``` to get your information and Access Token. Some of these will need your specific Register App details via Twitch Dev
    - *Note: There maybe a scenario that you will need to rerun ```npm run setup``` at different times, if not working correctly.*

### Notes 📝
1) Please ensure to clear OBS Browser cache **BEFORE & AFTER** streaming for safety, especially for the Admin Page
2) To have unique lines for a streamer, start up the localhost server and checkout the Admin page on a browser to add unique statements about them.
    - Required for the PHP DB File to run correctly 
## Overlay Setup
🚨Ensure that a localhost system is **running**

Head over to /ptso-twitch/admin on your browser **running** the localhost system and head to the Browser Overlay URL Generator Tab

❗Recommended OBS Browser Dimension Sizes❗
- Width: 800
- Height: 350

## 🛠️ Future Updates to Fix
|Task| Critcality |
|------|-------|
|SO.html: Single Line Carousel during activation| **CRITICAL FEATURE** | 
|⭐️ Admin: Twitch API Integration |Complete|
|⭐️ System: Use Twitch ID instead as a reference system due to potential username changes over time|Completed|
|Admin: Automatic Front-end Saving|In Progress|
|📌Admin: Proper Database Calling via MongoDB/MySQL/SQLite|In Progress|
|Admin/System?: User Customization under request of some Twitch Streamers (eg: Box Color, Font Family, etc...)|In progress|
|Kick Streaming Implementation???? |???|