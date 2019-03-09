function checkBook($input){
    if(!isUser)$loginModal.modal('show');
    else{
        const bool=$input.is(':checked'),
            id=$input.attr('name'),
            color=bool?$input.data('color'):'#A1A1A1',
            html=bool?$input.next().html():'이 책을',
            status=bool?$input.val():'null';
        $.ajax({
            url: '/user/interestedBook',
            type: 'POST',
            cache:false,
            data:{bookID:id,status:status},
            success: function (result) {
                if(result.result===true){
                    $('#book div>label>input[name='+id+']').each(function(index,item){
                        $(this).prop('checked',$(this).val()===status).parent().parent().slideUp().prev().css({backgroundColor:color}).html(html).removeClass('opened');
                    });
                }
                else alert('인터넷 연결 확인 후 다시 시도해주세요');
            },
            error:function(req,st,err){ajaxError(req,st,err,'/user/interestedBook')},
        });
    }
}
$(document).on('mousedown',function(event){
    //검색창 열렸을 때 검색창외에 클릭하면 검색창 숨김.
    if(!$(event.target).closest('#book .item>.btn.opened,#book .item>.btn.opened+div').length){
        $('#book .item>.btn.opened').removeClass('opened').next().slideUp();
    }

        // $('#book .item>.btn').forEach(function(item){
        // if(!$(event.target).closest(item).length){
        //     $(item).next().slideUp();
        // }
});