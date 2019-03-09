let $loginModal=$('#loginModal');

$(document).ready(function(){
    //input에 값이 있으면 밑줄 효과. 로그인/회원가입/비번찾기 등등
    //브라우저 자동저장 기능으로 값이 처음부터 채워지는 경우가 있으므로 로딩하자마자 change 효과 준다.
    $('.form-label>input').change();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(function(reg){
        }).catch(function(err){
            console.log(err);
        });
    }
}).on('click',function(event){
    //검색창 열렸을 때 검색창외에 클릭하면 검색창 숨김.
    if(!$(event.target).closest('#search-result').length&&!$(event.target).closest('#search-school').length){
        $('#search-result').slideUp();
    }
});
function formLabelChange($div){
    if($div.val())$div.addClass('filled');
    else $div.removeClass('filled');
}
function mapUrl(uName,mName){return "/map?school="+encodeURI(uName)+(mName?("&major="+encodeURI(mName)):"");}
function logoUrl(uName){return 'https://majormap.blob.core.windows.net/logo/'+(uName?'original/'+encodeURI(uName).replace(/\(/gi,'%28').replace(/\)/gi,'%29')+'.jpg':'underConstruction.png');}
function postLog(type,description,addJSON,callback){
    $.ajax({
        type: 'POST',
        url: '/api/log',
        cache:false,
        data: $.extend({type:type,description: description},addJSON),
        success: function(result) {if(result.result===true){callback();}},
        error:function(req,st,err){ajaxError(req,st,err,'post/api/log')},
    });
}
function ajaxError(req,st,err,errorName){
    if(err==='abort'||req.readyState===0)return false;
    else {console.log('error:'+errorName);postLog(-1,errorName+':'+req.status+';'+st+';'+req.responseText+';'+err,{},function(){});}
}
//한글 받침있는지 확한하고 옆에 글자 추가
function appendHangeul(string,hasbatchim,nobatchim){
    let name=string.replace(/\([^)]*\)| /g,''),last=name.charAt(name.length-1);
    return string+(last.match(/[^ㄱ-ㅎ가-힣]/)||(last.charCodeAt(0)-44032)%28>0?hasbatchim:nobatchim);
}
// 애플이 ios10에서 핀치줌 강제적용시켜버림. 그래서 강제로 끔.
document.documentElement.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, false);
// 애플이 더블탭 줌도 강제적용했길래 강제로 끔.
var lastTouchEnd = 0;
document.documentElement.addEventListener('touchend', function (event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);
