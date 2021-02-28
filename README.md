# Discord Speaking Detector for OBS

### Detects if specific users are speaking and toggles a specific source within OBS.

## Installation
1. Download [Node.JS](https://nodejs.org/en/) `14.16.0 LTS` was used for development
2. Clone the repo `git clone https://github.com/Saamstep/discord-speak-detector-obs.git`
3. Enter the installation directory `cd discord-speak-detector-obs/`
4. Install node modules `npm install`

## Setup
1. Copy the config and fill out as desired `cp example.config.json config.json`
```
{
    "token": "", //Bot token
    "guild": "", //Guild ID
    "liveChannelID": "", //Voice channel to detect speaking in
    "prefix": "-", //Bot prefix
    "perms": "", //Admin role name or role ID
    "casters": [""], //List of Discord User ID's you want to detect (a user who is not on this list wil not be detected)
    "scene_name": "", //The name of the specific scene to toggle sources in (multi-scene support coming soon)
    "websocket": "localhost:4444", //Websocket address
    "password": "" //If you have a password for your obs websocket enter it here or leave this blank
}
```
2. In OBS the source name for each user must be equal to the specific user's Discord ID and this source __must__ be in the scene specified in the config

## Example
If we had the following users we wanted to detect:
`1234`
`8765`

The **casters** array in the `config.json` must be `["1234", "8765"]`
In OBS I would create two scenes of ANY type (only the name of the scene matters) and name them accordingly 
![obs screenshot](https://i.imgur.com/zgZpfpF.png)

## Usage
### Start
Run `npm start`

### Stop
Run `npm stop`

## Notes
* You can close the terminal window after starting app if desired.

* To Open Bot Logs: `npm logs`


