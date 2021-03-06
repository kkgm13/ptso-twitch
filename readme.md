# Personalized Textual Shoutout Overlay for Twitch (PTSO)

![PTSO Twitch (Alpha V0.3)](ptso-twitch-alphaV0.3.gif)

**Not final version**

A LocalHosted Shoutout Overlay system for Streamers, with personalized streamer-tailored liners about the streamer via ADMIN section. System accessible to Twitch Moderators and Channel Streamer only. *Example shown in template.html as visual aspect for Version 1.0*

### 🛠️ Future Updates to fix
|Task| Critcality |
|------|-------|
|SO.html: Single Line Carousel during activation| CRITICAL FEATURE | 
|Admin: Finish Edit System from Streamer Table| High |
|⭐️ System: Use Twitch ID instead as a reference system due to potential username changes over time|Mid|
|Admin: Automatic Saving|Mid|
|System: Refactor and/or PHP variation|Low|
|Admin: Proper Database Calling via MongoDB or MySQL|TBC|
|📌 Admin?: User Customization under request of some Twitch Streamers (eg: Box Color, Font Family, etc...)|In progress|

-----
## Prerequisites❗
- Preferably have a LocalHost system running (LAMP/WAMP Stack)
    - Example usage: [MAMP](https://www.mamp.info/)
        - If going with MAMP, ensure MAMP's Document Root folder calling a folder above this system (eg: DocRootFolder/ptso-twitch/)
- [OBS Studio](https://obsproject.com) (May work with StreamLabs [Not Tested])
    - Ensure Twitch Account is connected

## Setup ⚙️
#### Overlay Setup
🚨Ensure that the localhost system is **running** correctly

Head over to /ptso-twitch/admin on your browser **running** the localhost system and head to the Browser Overlay URL Generator

❗Recommended OBS Browser Dimension Sizes❗
- Width: 800
- Height: 350

#### PTSO Admin controls
1.1) First time usage: Unzip streamdata.zip in admin folder FIRST!
1.2) Head over to ptso-twitch/admin on your browser

### Notes 📝
1) Please ensure to clear OBS Browser cache **before and after** stream for safety, especially with working with Admin Section
2) To have unique lines of a streamer, head over to the admin page on a browser to add unique statements about them.