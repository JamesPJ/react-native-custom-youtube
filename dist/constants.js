Object.defineProperty(exports,"__esModule",{value:true});exports.DEFAULT_BASE_URL=exports.CUSTOM_USER_AGENT=exports.PLAYER_ERROR=exports.PLAYER_ERROR_NAMES=exports.PLAYER_STATES=exports.PLAYER_STATES_NAMES=exports.UNMUTE_MODE=exports.MUTE_MODE=exports.PAUSE_MODE=exports.PLAY_MODE=void 0;var PLAY_MODE=true;exports.PLAY_MODE=PLAY_MODE;var PAUSE_MODE=false;exports.PAUSE_MODE=PAUSE_MODE;var MUTE_MODE=true;exports.MUTE_MODE=MUTE_MODE;var UNMUTE_MODE=false;exports.UNMUTE_MODE=UNMUTE_MODE;var PLAYER_STATES_NAMES={UNSTARTED:'unstarted',ENDED:'ended',PLAYING:'playing',PAUSED:'paused',BUFFERING:'buffering',VIDEO_CUED:'video cued'};exports.PLAYER_STATES_NAMES=PLAYER_STATES_NAMES;var PLAYER_STATES={'-1':PLAYER_STATES_NAMES.UNSTARTED,0:PLAYER_STATES_NAMES.ENDED,1:PLAYER_STATES_NAMES.PLAYING,2:PLAYER_STATES_NAMES.PAUSED,3:PLAYER_STATES_NAMES.BUFFERING,5:PLAYER_STATES_NAMES.VIDEO_CUED};exports.PLAYER_STATES=PLAYER_STATES;var PLAYER_ERROR_NAMES={INVALID_PARAMETER:'invalid_parameter',HTML5_ERROR:'HTML5_error',VIDEO_NOT_FOUND:'video_not_found',EMBED_NOT_ALLOWED:'embed_not_allowed'};exports.PLAYER_ERROR_NAMES=PLAYER_ERROR_NAMES;var PLAYER_ERROR={2:PLAYER_ERROR_NAMES.INVALID_PARAMETER,5:PLAYER_ERROR_NAMES.HTML5_ERROR,100:PLAYER_ERROR_NAMES.VIDEO_NOT_FOUND,101:PLAYER_ERROR_NAMES.EMBED_NOT_ALLOWED,150:PLAYER_ERROR_NAMES.EMBED_NOT_ALLOWED};exports.PLAYER_ERROR=PLAYER_ERROR;var CUSTOM_USER_AGENT='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36';exports.CUSTOM_USER_AGENT=CUSTOM_USER_AGENT;var DEFAULT_BASE_URL='https://lonelycpp.github.io/react-native-youtube-iframe/iframe.html';exports.DEFAULT_BASE_URL=DEFAULT_BASE_URL;