let loginAjax=null;
function login(){
    loginAjax=$.ajax({
        url: '/auth/login',
        type: 'POST',
        cache:false,
        data:$('#loginForm').serialize(),
        beforeSend:function(){if(loginAjax!==null)loginAjax.abort();},
        success: function (result){
            if(result.TYPE===0){window.location.reload();}
            else if(result.TYPE===10){window.location.href='/user/mypage/modify'}
            else{
                $('#loginForm .form-label').removeClass('color-up').children('output').html('').css({opacity:0});
                $('#loginForm .form-label').eq(result.TYPE-1).addClass('color-up').children('output').html(result.message).css({opacity:1});
            }
        },
        error:function(req,st,err){ajaxError(req,st,err,$('#loginForm').attr('action'))},
        complete:function(){loginAjax=null;}
    });
}

function snsLogin(snsName){
    window.location.href='/auth/login/'+snsName;
}