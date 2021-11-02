import {MUTE_MODE, PAUSE_MODE, PLAY_MODE, UNMUTE_MODE} from './constants';

export const PLAYER_FUNCTIONS = {
  muteVideo: 'player.mute(); true;',
  unMuteVideo: 'player.unMute(); true;',
  playVideo: 'player.playVideo(); true;',
  pauseVideo: 'player.pauseVideo(); true;',
  getVideoUrlScript: `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getVideoUrl', data: player.getVideoUrl()}));
true;
  `,
  durationScript: `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getDuration', data: player.getDuration()}));
true;
`,
  currentTimeScript: `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getCurrentTime', data: player.getCurrentTime()}));
true;
`,
  isMutedScript: `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'isMuted', data: player.isMuted()}));
true;
`,
  getVolumeScript: `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getVolume', data: player.getVolume()}));
true;
`,
  getPlaybackRateScript: `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getPlaybackRate', data: player.getPlaybackRate()}));
true;
`,
  getAvailablePlaybackRatesScript: `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getAvailablePlaybackRates', data: player.getAvailablePlaybackRates()}));
true;
`,

  setVolume: volume => {
    return `player.setVolume(${volume}); true;`;
  },

  seekToScript: (seconds, allowSeekAhead) => {
    return `player.seekTo(${seconds}, ${allowSeekAhead}); true;`;
  },

  setPlaybackRate: playbackRate => {
    return `player.setPlaybackRate(${playbackRate}); true;`;
  },

  loadPlaylist: (playList, startIndex, play) => {
    const index = startIndex || 0;
    const playlistJson = JSON.stringify(playList);
    const func = play ? 'loadPlaylist' : 'cuePlaylist';

    return `player.${func}({playlist: ${playlistJson}, index: ${index}); true;`;
  },
};

export const playMode = {
  [PLAY_MODE]: PLAYER_FUNCTIONS.playVideo,
  [PAUSE_MODE]: PLAYER_FUNCTIONS.pauseVideo,
};

export const soundMode = {
  [MUTE_MODE]: PLAYER_FUNCTIONS.muteVideo,
  [UNMUTE_MODE]: PLAYER_FUNCTIONS.unMuteVideo,
};

export const MAIN_SCRIPT = (
  videoId,
  playList,
  initialPlayerParams,
  allowWebViewZoom,
  contentScale,
) => {
  const {
    end,
    rel,
    color,
    start,
    playerLang,
    loop = false,
    cc_lang_pref,
    iv_load_policy,
    modestbranding,
    controls = true,
    showClosedCaptions,
    preventFullScreen = false,
  } = initialPlayerParams;

  // _s postfix to refer to "safe"
  const rel_s = rel ? 1 : 0;
  const loop_s = loop ? 1 : 0;
  const videoId_s = videoId || '';
  const controls_s = controls ? 1 : 0;
  const cc_lang_pref_s = cc_lang_pref || '';
  const modestbranding_s = modestbranding ? 1 : 0;
  const preventFullScreen_s = preventFullScreen ? 0 : 1;
  const showClosedCaptions_s = showClosedCaptions ? 1 : 0;
  const contentScale_s = typeof contentScale === 'number' ? contentScale : 1.0;

  const list = typeof playList === 'string' ? playList : undefined;
  const listType = typeof playList === 'string' ? 'playlist' : undefined;
  const playlist = Array.isArray(playList) ? playList.join(',') : undefined;

  // scale will either be "initial-scale=1.0"
  let scale = `initial-scale=${contentScale_s}`;
  if (!allowWebViewZoom) {
    // or "initial-scale=0.8, maximum-scale=1.0"
    scale += `, maximum-scale=${contentScale_s}`;
  }

  const safeData = {
    end,
    list,
    start,
    color,
    rel_s,
    loop_s,
    listType,
    playlist,
    videoId_s,
    controls_s,
    playerLang,
    iv_load_policy,
    contentScale_s,
    cc_lang_pref_s,
    allowWebViewZoom,
    modestbranding_s,
    preventFullScreen_s,
    showClosedCaptions_s,
  };

  const urlEncodedJSON = encodeURI(JSON.stringify(safeData));

  const listParam = list ? `list: '${list}',` : '';
  const listTypeParam = listType ? `listType: '${list}',` : '';
  const playlistParam = playList ? `playlist: '${playList}',` : '';

  const htmlString = `
<!DOCTYPE html>
<html>
  <head>
    <meta
      name="viewport"
      content="width=device-width, ${scale}"
    >
    <style>
      body {
        margin: 0;
      }
      .audio-tag { outline: none !important; text-decoration: none;}

      .play_media
      {
      top: -60%;
      width: 20%;
      display:none;
      }
      .video_wrap
      {
      width:100%;
      }
      .video_container {
      height: 0;
      position: relative;
      padding-bottom:56.25%;
      }
      .video_container video 
      {
      bottom: 0;
      height: 100%;
      left: 0;
      right: 0;
      top: 0;
      width: 100%;
      position:absolute;
      } 
      .video_container iframe, .video_container .div_vid_res,.video_container embed
      {
      bottom: 0;
      height: 100%;
      left: 0;
      right: 0;
      top: 0;
      width: 100%;
      position:absolute;
      } 
      .controls
      {
      -moz-box-align: end;
      align-items: flex-end;
      bottom: 0;
      display: flex;
      left: 0;
      opacity: 1;
      padding: 10px;
      position: absolute;
      right: 0;
      z-index: 8;
      -webkit-box-align: end;
      display: -webkit-box;
      }
      .playpauseui
      {
      color: #ffffff;
      height: 36.5px;
      transition: opacity 250ms ease-out 0s, background-color 40ms ease 0s, color 40ms ease 0s;
      width:9%;
      max-width:45px;
      -webkit-transition:opacity 250ms ease-out 0s, background-color 40ms ease 0s, color 40ms ease 0s;
      cursor:pointer !important;
      }
      .rounded-box
      {
      background: rgba(23, 35, 34, 0.75) none repeat scroll 0 0;
      }
      .playpauseui:hover
      {
      background-color: #ff0000;
      }
      .play
      {
      box-sizing: border-box;
      margin: 0 auto;
      padding: 10px 0;
      text-align: center;
      width: 25%;
      }
      .pause
      {
      box-sizing: border-box;
      margin: 0 auto;
      padding: 10px 0;
      text-align: center;
      width: 25%;
      display:none;
      }
      .play_bar
      {
      -moz-box-flex: 1;
      -moz-box-pack: end;
      display: flex;
      flex: 1 1 0;
      justify-content: flex-end;
      position: relative;
      height: 36.5px;
      display:-webkit-box;
      -webkit-box-pack: end;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      }
      .seekbar
      {
      -moz-box-flex: 1;
      border: 0.1em solid #666666;
      cursor: pointer;
      flex: 1 1 0;
      position: relative;
      margin:14px 8px 10px 4px;
      height:10px;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      cursor:pointer;
      }
      .ptimescale
      {
      font-size: 11px; margin: 12px 0px; color: #ffffff;
      }
      .seekbar_buffer
      {
      background-color: #ff0000;
      height:100%;
      width:0;
      }
      .volume
      {
      float:left;
      position: relative;
      height:36.5px;
      padding: 0 1% 0 0;
      }
      .volume ul
      {
      margin:10px 0 0 10px;
      padding:0;
      }
      .volume ul li
      {
      background-color: #ff0000;
      float: left;
      list-style-type: none;
      margin: 0 0 0 2px;
      padding: 8px 2px;
      transition: all .1s ease-in-out;
      -webkit-transition:all .1s ease-in-out;
      cursor:pointer !important;
      }
      .volume ul li:hover
      {
      transform: scaleY(1.5);
      -webkit-transform: scaleY(1.5);
      }
      .mute-unmute
      {
      -moz-box-flex: 0;
      -moz-box-pack: end;
      display: flex;
      flex: 0 1 0;
      height: 36.5px;
      justify-content: flex-end;
      width: 8%;
      padding: 0 0 0 0;
      }
      .unmute
      {
      fill: #ffffff;
      height: 100%;
      margin: 6px 0 0 8px;
      width: 1.6em;
      cursor:pointer !important;
      }
      .mute
      {
      fill: #ffffff;
      height: 100%;
      width: 1.6em;
      margin: 3px 0 0 15px;
      display:none;
      cursor:pointer !important;
      overflow: hidden;
      }
      .fullscreen
      {
      height: 36.5px;
      margin:0;
      padding:0 1% 0 1.5%;
      width: 1.2em;
      }
      .fill
      {
      transition:fill 40ms ease 0s;
      -webkit-transition:fill 40ms ease 0s;
      fill:#ffffff;
      }
      .fillfullscreen
      {
      transition:fill 40ms ease 0s;
      -webkit-transition:fill 40ms ease 0s;
      fill:#ffffff;
      height: 100%;
      }
      .fullsc
      {
      margin:11px 0 0 0;
      cursor:pointer !important;
      }
      .fullscreen:hover .fillfullscreen
      {
      fill: #ff0000;
      }
      .volfill_10 li:nth-child(-n+1)
      {
        background: #ffffff;
      }
      .volfill_20 li:nth-child(-n+2)
      {
        background: #ffffff;
      }
      .volfill_40 li:nth-child(-n+3)
      {
        background: #ffffff;
      }
      .volfill_60 li:nth-child(-n+4)
      {
        background: #ffffff;
      }
      .volfill_80 li:nth-child(-n+5)
      {
        background: #ffffff;
      }
      .volfill_100 li:nth-child(-n+6)
      {
        background: #ffffff;
      }
      .video-controls {
          background: none;
          bottom: 0;
          left: 0;
        /* opacity: 0;*/
          position: absolute;
          right: 0;
          transition: opacity 0.3s ease 0s;
        -webkit-transition:opacity 0.3s ease 0s;
      }


      @media handheld, only screen and (max-width: 400px) {

      .play_media
      {
      background: none !important;
      bottom: 0;
      color: #ffffff;
      display: block;
      height: 120px;
      left: 0;
      position: absolute;
      right: 0;
      top: -115px;
      transition: opacity 250ms ease-out 0s, background-color 40ms ease 0s, color 40ms ease 0s;
      width: 100%;
      }
      .play_media:active 
      {
      background:none ! important;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      }
      .playpauseui:active 
      {
      background:transparent ! important;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      }
      .vhwidescreen
      {
      display:block ! important;
      background: rgba(23, 35, 34, 0.75) none repeat scroll 0 0 !important;
      width: 10%;
      padding-top: 0;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      }
      .vhwidescreen:hover 
      {
      background: #ff0000 !important;
      }
      .vhwidescreen:active 
      {
      background: #ff0000 !important;
      -webkit-tap-highlight-color: #ff0000 !important;
      }
      .play,.pause
      {
        box-sizing: border-box;
      /*    margin: 9px 0 auto;*/
          padding: 0;
          text-align: center;
          width: auto;
      }
      .fullscreen_media
      {
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
          fill: #fff;
          height: 17px;
          padding: 3px !important;
          text-align: center;
          transition: fill 40ms ease 0s;
          width: 17px;
      line-height: 18px;
      }
      .seekbar
      {
      display:block;
      height: 6px;
      margin: 21px 8px 10px 4px;
      background:rgba(23, 35, 34, 0.75) none repeat scroll 0 0 !important;
      border:0.1px solid #151E1E;
      }
      .ptimescale {
          font-size: 9px;
          margin: 18px 4px 19px 0;
      }
      .mute-unmute
      {
      display:none;
      }
      .volume
      {
      display:none;
      }
      .fullbg
      {
      background: rgba(23, 35, 34, 0.75) none repeat scroll 0 0 !important;
      margin: 0;
      padding: 6px 5px 6px 11px;
      }
      .fullsc
      {
      margin:0 !important;
      }
      .rounded-box
      {
      background: none;
      }
      }

      @media only screen and (min-width: 235px) and (max-width: 319px) 
      {
      .play_media
      {
      background: none !important;
      bottom: 0;
      color: #ffffff;
      display: block;
      height: 120px;
      left: 0;
      position: absolute;
      right: 0;
      top: -115px;
      transition: opacity 250ms ease-out 0s, background-color 40ms ease 0s, color 40ms ease 0s;
      width: 100%;
      }
      .play_media:active 
      {
      background:transparent ! important;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      }
      .playpauseui:active 
      {
      background:transparent ! important;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      }
      .playpauseui
      {
      background:none ! important;
      }
      .vhwidescreen
      {
        background: rgba(23, 35, 34, 0.75) none repeat scroll 0 0 !important;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        display: block !important;
        height: 14px;
        padding: 5px !important;
        width: 14px;
      }
      .play,.pause
      {
        margin:0 auto;
        padding:0;
        width:auto;
      }
      .mediumplay_btn,.mediumpause_btn
      {
        display:none ! important;
      }
      .smallplay_btn,.smallpause_btn
      {
        display:block ! important;
      }
      .vhwidescreen:active 
      {
      background: #ff0000 !important;
      -webkit-tap-highlight-color: #ff0000 !important;
      }
      .vhwidescreen:hover 
      {
      background: #ff0000 !important;
      }
      .fullsc
      {
      margin:0 !important;
      }
      }

      .big-play-button {
        height: 100%;
          position: absolute;
          text-align: center;
          width: 100%;
        top: 0;
        left: 0;
      }
      .big-play-button .big-play {
          position: absolute;
          top: 45%;
        left: 50%;
        -ms-transform: translate(-50%,-50%); /* IE 9 */
        -webkit-transform: translate(-50%,-50%); /* Safari */
        transform: translate(-50%,-50%);
        color: #FFF;
        font-size: 100px;
        line-height: 0;
        cursor: pointer;
          z-index: 10;
      }
      .vjs-poster
      {
        background-size: cover;
      }


      .vh_spd_txt {
        font-size: 11px;
          margin: 12px 0px;
          color: #ffffff;
      }
      .vh_spd_div {
        position: relative;
        cursor: pointer;
        width: 40px;
        text-align: center;
        height: 36.5px;
      }
      .vh_spd_abs_div {
        position: absolute;
        bottom: 100%;
        right: 0;
        width: 40px;
        background-color: rgba(7,20,30,.7);
        display: none;
      }
      .vh_spd_div:hover > .vh_spd_abs_div {
        display: block;
      }
      .vh_spd_abs_div a {
        display: inline-block;
        padding: .3em 0;
          line-height: 1.4em;
          font-size: 11px;
          text-align: center;
        width: 100%;
        color: #CCCCCC;
        text-decoration: none;
      }
      .vh_spd_abs_div a:hover {
        color: #111;
        background-color: rgba(255,255,255,.75);
        text-decoration: none;
        /* box-shadow: 0 0 1em #fff; */
      }
      .vh_spd_abs_div a.vh_spd_abs_a_act {
        color: #CCC;
        background-color: rgba(0,0,0,.8);
        text-decoration: none;
      }

      .videoWrapper {
          position: relative;
          padding-bottom: 56.6%;
          height: 0;
      }

      .videoWrapper .iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
      }
    </style>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  </head>
  <body>
    <div class="videoWrapper">
      <div class="iframe">
      <div id="video_container" class="video_container" style="width:100%;">
          <input type="hidden" id="video-currenttime" value="0">
          <input type="hidden" id="video-currenttime1" value="0">
          <input type="hidden" id="video-totaltime" value="0">
          <input type="hidden" id="video-rand" value="">
          <input type="hidden" id="cueml" value="">
          <iframe frameborder="0" id="vh-player" title="YouTube video player"
              src="https://www.youtube.com/embed/${videoId_s}?modestbranding=1&amp;amp;showinfo=0&amp;amp;autoplay=0&amp;amp;controls=0&amp;amp;rel=0&amp;amp;enablejsapi=1&amp;"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="">
          </iframe>
          <div style="clear:both;"></div>
          <div class="big-play-button playpause">
              <div class="big-play play"
                  style="background-color:#ff0000; border-radius: 9px; top: 50%; text-align: center; display: block; font-size: 46px; height: 68px; padding: 0px; line-height: 68px; width: 95px;">
                  <i class="fa fa-play" aria-hidden="true" style="font-size:1em;">></i>
              </div>
          </div>
          <div class="controls video-controls" style="visibility: hidden; display: none;">
              <div class="playpause playpauseui rounded-box vhwidescreen">
                  <div class="play">
                      <svg class="mediumplay_btn" preserveAspectRatio="xMidYMid" viewBox="0 0 20 20" width="20px"
                          height="20px" version="1.1" xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 20 20"
                          xml:space="preserve">
                          <polygon points="1,0 20,10 1,20" class="fill"></polygon>
                      </svg>
                      <svg class="smallplay_btn" style="display:none;" preserveAspectRatio="xMidYMid" viewBox="0 0 20 20"
                          width="16px" height="14px" version="1.1" xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 20 20"
                          xml:space="preserve">
                          <polygon class="fill" points="1,0 20,10 1,20"></polygon>
                      </svg>
                  </div>
                  <div class="pause">
                      <svg class="mediumpause_btn" preserveAspectRatio="xMidYMid" viewBox="0 0 20 20" version="1.1"
                          width="20px" height="20px" xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 20 20"
                          xml:space="preserve">
                          <rect y="0" x="0" height="20" width="6" class="fill"></rect>
                          <rect y="0" x="12" height="20" width="6" class="fill"></rect>
                      </svg>
                      <svg class="smallpause_btn" style="display:none;" preserveAspectRatio="xMidYMid" viewBox="0 0 20 20"
                          version="1.1" width="16px" height="14px" xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 20 20"
                          xml:space="preserve">
                          <rect y="0" x="0" height="20" width="6" class="fill"></rect>
                          <rect y="0" x="12" height="20" width="6" class="fill"></rect>
                      </svg>
                  </div>
                  <div class="clear"></div>
              </div>
              <div class="playpause playpauseui play_media">

                  <div class="clear"></div>
              </div>
              <div class="play_bar rounded-box">
                  <div class="seekbar">
                      <div class="seekbar_buffer">
                      </div>
                  </div>
                  <div class="clear"></div>
                  <div class="ptimescale">00:00 / 00:00</div>
              </div>
              <div class="mute-unmute rounded-box">
                  <div class="unmute">
                      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid" version="1.1"
                          xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                          enable-background="new 0 0 24 24" xml:space="preserve">
                          <g>
                              <g>
                                  <path class="fill" clip-rule="evenodd"
                                      d="M19.779,3.349l-1.111,1.664C20.699,6.663,22,9.179,22,12    c0,2.822-1.301,5.338-3.332,6.988l1.111,1.663C22.345,18.639,24,15.516,24,12C24,8.485,22.346,5.362,19.779,3.349z M17.55,6.687    l-1.122,1.68c0.968,0.913,1.58,2.198,1.58,3.634s-0.612,2.722-1.58,3.635l1.122,1.68C19.047,16.03,20,14.128,20,12    C20,9.873,19.048,7.971,17.55,6.687z M12,1c-1.177,0-1.533,0.684-1.533,0.684S7.406,5.047,5.298,6.531C4.91,6.778,4.484,7,3.73,7    H2C0.896,7,0,7.896,0,9v6c0,1.104,0.896,2,2,2h1.73c0.754,0,1.18,0.222,1.567,0.469c2.108,1.484,5.169,4.848,5.169,4.848    S10.823,23,12,23c1.104,0,2-0.895,2-2V3C14,1.895,13.104,1,12,1z"
                                      fill-rule="evenodd"></path>
                              </g>
                          </g>
                      </svg>
                  </div>
                  <div class="mute">
                      <svg viewBox="50 7 50 116" preserveAspectRatio="xMidYMid" style="width: 67px; height: 67px;"
                          version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                          enable-background="new 0 0 67 67" xml:space="preserve">
                          <path class="fill"
                              d="M51.952,22.29l-2.828-2.828L42,26.585V18h-4.018L27,29h-5v11.978h5l0.303,0.304l-6.428,6.428l2.828,2.828l6.427-6.427  L38.011,52H42V32.242L51.952,22.29z M28.658,36.978H26V33h2.659L38,23.643v6.941l-7.868,7.868L28.658,36.978z M38,46.329  l-5.041-5.046L38,36.242V46.329z">
                          </path>
                      </svg>
                  </div>
              </div>
              <div class="volume rounded-box">
                  <ul class="volfill_80">
                      <li class="volume-control" data-vol="10"></li>
                      <li class="volume-control" data-vol="20"></li>
                      <li class="volume-control" data-vol="40"></li>
                      <li class="volume-control" data-vol="60"></li>
                      <li class="volume-control" data-vol="80"></li>
                      <div class="clear"></div>
                  </ul>
                  <div class="clear"></div>
              </div>
              <div class="fullscreen fullscreen_media fullbg rounded-box" style="">
                  <svg class="fullsc" preserveAspectRatio="xMidYMid" viewBox="0 0 12 12" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                      enable-background="new 0 0 12 12" xml:space="preserve" width="15px" height="15px">
                      <polyline transform="translate(6,6)" points="6,6 5.9,2 4.9,3 2.9,1 1,2.9 3,4.9 2,5.9"
                          class="fillfullscreen fill"></polyline>
                      <polyline transform="translate(6,6) rotate(90)" points="6,6 5.9,2 4.9,3 2.9,1 1,2.9 3,4.9 2,5.9"
                          class="fillfullscreen fill"></polyline>
                      <polyline transform="translate(6,6) rotate(180)" points="6,6 5.9,2 4.9,3 2.9,1 1,2.9 3,4.9 2,5.9"
                          class="fillfullscreen fill"></polyline>
                      <polyline transform="translate(6,6) rotate(270)" points="6,6 5.9,2 4.9,3 2.9,1 1,2.9 3,4.9 2,5.9"
                          class="fillfullscreen fill"></polyline>
                  </svg>
              </div>
              <div class="rounded-box vh_spd_div">
                  <div class="vh_spd_txt">1x</div>

                  <div class="vh_spd_abs_div">
                      <a href="javascript: void(0)" onclick="vh_playbackRate(4);">4x</a>
                      <a href="javascript: void(0)" onclick="vh_playbackRate(2);">2x</a>
                      <a href="javascript: void(0)" onclick="vh_playbackRate(1.5);">1.5x</a>
                      <a href="javascript: void(0)" onclick="vh_playbackRate(1);">1x</a>
                      <a href="javascript: void(0)" onclick="vh_playbackRate(0.5);">0.5x</a>
                  </div>
              </div>

              <!-- <button onclick="vh_playbackRate();">seed</button> -->

          </div>
          <div class="clear"></div>
      </div>
      </div>
    </div>

    <script>
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player;
      function onYouTubeIframeAPIReady() {
        console.log('onYouTubeIframeAPIReady');
        player = new YT.Player('vh-player', {
          width: '1000',
          height: '1000',
          playerVars: {
            ${listParam}
            ${listTypeParam}
            ${playlistParam}

            end: ${end},
            rel: ${rel_s},
            playsinline: 1,
            loop: ${loop_s},
            color: ${color},
            start: ${start},
            hl: ${playerLang},
            controls: ${controls_s},
            fs: ${preventFullScreen_s},
            cc_lang_pref: '${cc_lang_pref_s}',
            iv_load_policy: ${iv_load_policy},
            modestbranding: ${modestbranding_s},
            cc_load_policy: ${showClosedCaptions_s},
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError,
            'onPlaybackQualityChange': onPlaybackQualityChange,
            'onPlaybackRateChange': onPlaybackRateChange,
          }
        });
      }


      function setCookie_monit(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }

      function setCookie_monit_pop(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }

      function onPlayerError(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'playerError', data: event.data}))
      }

      function onPlaybackRateChange(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'playbackRateChange', data: event.data}))
      }

      function onPlaybackQualityChange(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'playerQualityChange', data: event.data}))
      }

      function onPlayerReady(event) {
        console.log('player ready');
        window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'playerReady'}))
      }

      var done = false;
      function onPlayerStateChange(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'playerStateChange', data: event.data}))
      }

      var isFullScreen = false;
      function onFullScreenChange() {
        isFullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        isFullScreen = isFullScreen ? isFullScreen : {};
        window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'fullScreenChange', data: Boolean(isFullScreen)}));
      }

      document.addEventListener('fullscreenchange', onFullScreenChange)
      document.addEventListener('mozfullscreenchange', onFullScreenChange)
      document.addEventListener('msfullscreenchange', onFullScreenChange)
      document.addEventListener('webkitfullscreenchange', onFullScreenChange)

      function timeFromSecs(seconds) {
        var s = Math.floor(seconds % 60),
          m = Math.floor(seconds / 60 % 60),
          h = Math.floor(seconds / 3600),
  
          // Check if we need to show hours
          h = (h > 0) ? h + ':' : '';

          // If hours are showing, we may need to add a leading zero.
          // Always show at least one digit of minutes.
          m = ((m < 10) ? '0' + m : m) + ':';
      
          // Check if leading zero is need for seconds
          s = (s < 10) ? '0' + s : s;
      
          return h + m + s;
      }
    
      function video_forward(time) {
        var vhid = 'vh_player';
        if (document.getElementById(vhid)) {
            var vplayer = document.getElementById(vhid).contentWindow;
            var videocurrenttime = vplayer.vh_seekto(time);
        }
      }

      function vhplay() {
        $('.pause').show();
        $('.play').hide();
        player.playVideo();
      }

      function vhpause() {
        $('.pause').hide();
        $('.play').show();
        player.pauseVideo();
      }
      
      function changeseekbar() // Seek bar control
      {
        if (typeof player.getPlayerState === "function") {
            var a = player.getCurrentTime();
            var b = Math.floor(a);
            var z = player.getDuration();
            var loaded = (b / z) * 100;
    
            var playerstate = player.getPlayerState();
            if (playerstate != 0) {
                $(".seekbar_buffer").css('width', loaded + '%');
            }
        }
      }
      
      $(document).ready(function () {
        // Play Pause control
        $(document).on('click', '.playpause', function () {
            var playerstate = player.getPlayerState();
            if (playerstate == 1) {
                $('.pause').hide();
                $('.play').show();
                player.pauseVideo();
            }
            else if (playerstate == 2 || playerstate == -1 || playerstate == 5 || playerstate == 3 || playerstate == 0) {
                $('.pause').show();
                $('.play').hide();
                player.playVideo();
            }
        });
    
        //Volume control
        $(document).on('click', '.volume-control', function () {
            var val = $(this).attr("data-vol");
            player.setVolume(val);
            if (val == 0) {
                player.mute();
                $(".mute-unmute div.mute").show();
                $(".mute-unmute div.unmute").hide();
            }
            else {
                player.unMute();
                $(".mute-unmute div.mute").hide();
                $(".mute-unmute div.unmute").show();
            }
            $(".volume ul").removeAttr("class")
            $(".volume ul").addClass("volfill_" + val);
        });
    
        // Mute-Unmute control
        $(document).on('click', '.mute-unmute', function () {
            if (player.isMuted()) {
                player.unMute();
                $(".mute-unmute div.mute").hide();
                $(".mute-unmute div.unmute").show();
    
            }
            else {
                player.mute();
                $(".mute-unmute div.mute").show();
                $(".mute-unmute div.unmute").hide();
            }
        });
    
        // Full screen control
        function isFullScreen() {
          return (document.fullScreenElement && document.fullScreenElement !== null)
              || document.mozFullScreen
              || document.webkitIsFullScreen;
        }
        
        function requestFullScreen(element) {
          if (element.requestFullscreen)
              element.requestFullscreen();
          else if (element.msRequestFullscreen)
              element.msRequestFullscreen();
          else if (element.mozRequestFullScreen)
              element.mozRequestFullScreen();
          else if (element.webkitRequestFullscreen)
              element.webkitRequestFullscreen();
        }
        
        function exitFullScreen() {
          if (document.exitFullscreen)
              document.exitFullscreen();
          else if (document.msExitFullscreen)
              document.msExitFullscreen();
          else if (document.mozCancelFullScreen)
              document.mozCancelFullScreen();
          else if (document.webkitExitFullscreen)
              document.webkitExitFullscreen();
        }
        
        function toggleFullScreen(vid) {
          var element = document.getElementById(vid);
          if (isFullScreen())
              exitFullScreen();
          else
              requestFullScreen(element || document.documentElement);
        }
        
        $(document).on('click', '.fullscreen', function () {
            var cont = 1;
            toggleFullScreen('video_container');
            /*var player = document.getElementById('vh-player');
            if (player.requestFullscreen) {
                player.requestFullscreen();
            } else if (player.mozRequestFullScreen) {
                player.mozRequestFullScreen(); // Firefox
            } else if (player.webkitRequestFullscreen) {
                player.webkitRequestFullscreen(); // Chrome and Safari
            }*/
        });
    
        //VIDEO PROGRESS BAR
        //when video timebar clicked
        var timeDrag = false;	/* check for drag event */
        $('.seekbar').on('mousedown', function (e) {
            timeDrag = true;
            updatebar(e.pageX);
        });
        $('.seekbar').on('mouseover', function (e) {
            update_timebar(e.pageX);
        });
        $('.seekbar').on('mousemove', function (e) {
            update_timebar(e.pageX);
        });
        $(document).on('mouseup', function (e) {
            if (timeDrag) {
                timeDrag = false;
                updatebar(e.pageX);
            }
        });
        var vtimer;
        $(document).on('mousemove', function (e) {
            if (timeDrag) {
                updatebar(e.pageX);
            }
            if (vtimer) {
                clearTimeout(vtimer);
                vtimer = 0;
            }
            $(".controls").show();
            vtimer = setTimeout(function () {
                $(".controls").fadeOut(3000);
            }, 1000);
        });
    
        var updatebar = function (x) {
            var progress = $('.seekbar');
            //calculate drag position
            //and update video currenttime
            //as well as progress bar
            var maxduration = player.getDuration();
            var position = x - progress.offset().left;
            var percentage = 100 * position / progress.width();
            if (percentage > 100) {
                percentage = 100;
            }
            if (percentage < 0) {
                percentage = 0;
            }
            $('.seekbar_buffer').css('width', percentage + '%');
            player.seekTo(parseFloat(maxduration * percentage / 100));
    
        };
        var update_timebar = function (x) {
            var progress = $('.seekbar');
            var maxduration = player.getDuration();
            var position = x - progress.offset().left;
            var percentage = 100 * position / progress.width();
            if (percentage > 100) {
                percentage = 100;
            }
            if (percentage < 0) {
                percentage = 0;
            }
            var currpos = parseFloat(maxduration * percentage / 100);
            $('.seekbar').attr("title", timeFromSecs(currpos) + "/" + timeFromSecs(maxduration));
    
        }
        // Show/hide controls on mouse over
        $(document).on('mouseover', function (e) {
            $(".controls").show();
        });
        $(document).on('mouseleave', function (e) {
            //var player = document.getElementById('vh-player_60591');
            //var player = document.getElementById("vh-player");
            playerstate = player.getPlayerState();
            if (playerstate == 1) {
                $(".controls").hide();
            }
        });
      });
      window.vh_seekto = function(secs) // Seek bar control
      {
          //var player = document.getElementById("vh-player");
          //player.playVideo();
          player.seekTo(secs);
      }
      window.vh_playbackRate = function(val) // Seek bar control
      {
          //alert(val);
          player.setPlaybackRate(val);
          val_x = val + 'x';
          $('.vh_spd_txt').text(val_x);
      }
      function vh_player_ended() {
          mod_end();
      }
      
      function onPlayerStateChange(event) {
          timeupdater = setInterval(changeseekbar, 100);
          switch (event.data) {
              case YT.PlayerState.PLAYING:
                  $('.video-controls').css("visibility", "visible");
                  $('.pause').show();
                  $('.play').hide();
                  break;
              case YT.PlayerState.ENDED:
                  $('.pause').hide();
                  $('.play').show();
                  vh_player_ended();
                  $(".seekbar_buffer").css('width', '100%');
                  $(".controls").show();
                  break;
              case YT.PlayerState.PAUSED:
                  $('.pause').hide();
                  $('.play').show();
                  break;
          }
      }
    </script>
  </body>
</html>
`;

  return {htmlString, urlEncodedJSON};
};
