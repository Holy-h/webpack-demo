function isNaverApp(){
    let userAgent = navigator.userAgent.toLowerCase();
    return userAgent.match(/naver/g)&&userAgent.match(/(iphone)|(ipad)|(ipod)|(android)/g);
}
function addShortcutIcon(){
    let userAgent = navigator.userAgent.toLowerCase();
    if(userAgent.match(/(iphone)|(ipad)|(ipod)/)) {
        document.write('<object id="bookmark_obj" type="text/html" data="naversearchapp://addshortcut?url=https://www.majormap.net&icon=https://www.majormap.net/img/majorMap/favicon256.png&title=메이저맵&serviceCode=MajorMap&version=7" width="0" height="0"></object>')
    } else if(userAgent.match(/android/)) {
        document.write('<object id="bookmark_obj" type="text/html" data="naversearchapp://addshortcut?url=https://www.majormap.net&icon=https://www.majormap.net/img/majorMap/favicon256.png&title=메이저맵&serviceCode=MajorMap&version=7" width="0" height="0"></object>')
    }
    $.post('/api/noShortcut',{shortcutAgree:true,description:navigator.userAgent},function(result){
        if(result.result)$('#addShortcut').fadeOut();
    })
}
function noShortcutIcon() {
    $.post('/api/noShortcut',{shortcutAgree:false,description:navigator.userAgent},function(result){
        if(result.result) $('#addShortcut').fadeOut();
    });
}