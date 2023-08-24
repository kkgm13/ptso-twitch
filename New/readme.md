# Updated Personalized Textual Shoutout Overlay for Twitch (PTSO)

A Localized and Self-Hosted Twitch Shoutout Overlay system for Streamers, with personalized streamer-tailored text about a specified streamer via ADMIN section. Overlay trigger is accessible to Twitch Moderators and Channel Streamer only. Using the new Twitch Helix API system.

-----
## Prerequisites❗
- Preferably have a LocalHost system running (LAMP/WAMP Stack)
    - Example usage:
        - [MAMP](https://www.mamp.info/)
            - If utilizing MAMP, ensure MAMP's Document Root folder calling a folder above this system (eg: DocRootFolder/ptso-twitch/)
        - [XAMPP](https://www.apachefriends.org/download.html)
            - If utilizing XAMPP, ensure the ptso-twitch folder is stored in the htdocs folder inside XAMPP.    
- [OBS Studio](https://obsproject.com) (Will work with StreamLabs [Not Recommended])
    - Ensure Twitch Account is connected

### Notes 📝
1) Please ensure to clear OBS Browser cache **before and after** stream for safety, especially with extensive data work with Admin Section
2) To have unique lines for a streamer, load up the server and checkout the Admin page on a browser to add unique statements about them.