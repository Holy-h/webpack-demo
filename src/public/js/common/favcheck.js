
// 로그인 안했으면 로그인모달. 아니면 즐겨찾기 추가.
function favCheck($div){
    if(!isUser){$loginModal.modal('show');return;}
    let boolean=$div.hasClass('checked');
    $.ajax({
        type: 'POST',
        url: '/user/interestedMajor',
        cache:false,
        data: {
            university: $div.data('uname'),
            major: $div.data('mname'),
            isChecked:boolean
        },
        success: function(result){
            if(result.result){
                if(boolean){$div.removeClass('checked');alert('즐겨찾기에서 삭제되었습니다');}
                else{$div.addClass('checked');alert('즐겨찾기에 추가되었습니다');}
            }else{alert('인터넷 연결을 확인해주세요');}
        },
        error:function(req,st,err){ajaxError(req,st,err,'post/user/interestedMajor')},
        complete:function(){}
    });
}