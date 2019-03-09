let loginAjax=null;
function logout(){
    loginAjax=$.ajax({
        url: '/auth/logout',
        type: 'GET',
        cache:false,
        data:{},
        beforeSend:function(){if(loginAjax!==null)loginAjax.abort();},
        success: function (result) {
            if(result.result===true){
                alert('로그아웃되었습니다');
                window.location.href='/';
            }
            else alert('로그아웃 실패. 인터넷 연결 확인 후 다시 시도해주세요');
        },
        error:function(req,st,err){ajaxError(req,st,err,'/auth/logout')},
        complete:function(){loginAjax=null;}
    });
}