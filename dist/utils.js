Object.defineProperty(exports,"__esModule",{value:true});exports.deepComparePlayList=void 0;var deepComparePlayList=function deepComparePlayList(lastPlayList,playList){if(lastPlayList===playList){return true;}if(Array.isArray(lastPlayList)&&Array.isArray(playList)){return lastPlayList.join('')===playList.join('');}return false;};exports.deepComparePlayList=deepComparePlayList;