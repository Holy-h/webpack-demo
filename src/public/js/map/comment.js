let pageNum=1,totalPageNum=1;

// 댓글목록 불러오기.
let getCommentAjax=null;
function showComment(page){
    pageNum=page;
    if(pageNum<1)pageNum=1;
    else if(pageNum>totalPageNum)pageNum=totalPageNum;
    $('#page-now').val(pageNum);
    getCommentAjax=$.ajax({
        url: '/map/comment',
        data: {page:pageNum},
        cache:false,
        type: 'GET',
        beforeSend:function(){$('#replys').animate({opacity:0.5});if(getCommentAjax!==null)getCommentAjax.abort();},
        success: function(result) {
            $('#replys').html(result);
            totalPageNum=parseInt($('#totalPage').val());
            $('#page-total').html(totalPageNum);
        },
        error:function(req,st,err){ajaxError(req,st,err,'get/map/comment')},
        complete:function(){$('#replys').animate({opacity:1});getCommentAjax=null;}
    });
}

//댓글 등록하기
let postComment=null;
function submitComment(){
    // 로그인안했으면 로그인모달.
    if(!isUser){$loginModal.modal('show');return false;}
    // 로그인했으면 디비 넘김.
    let comment=$('#comment-comment').val();
    if(comment.length>100){alert('댓글은 100글자 이내로 적어주세요');return false;}
    if(!comment){alert('댓글을 입력해주세요');return false;}
    postComment=$.ajax({
        type:'POST',
        url: '/map/comment',
        cache:false,
        data: {
            question:$('#comment-question').val(),
            comment:comment.replace(/</g,'&lt;').replace(/>/g,'&gt;'),
            univ:uName,
            major:mName
        },
        beforeSend:function(){if(postComment!==null)postComment.abort();},
        success: function(result) {
            if(result.result===true){
                alert('댓글이 등록되었습니다.');
                $('#comment-question').val(result.newQuestion);
                $('#comment-comment').val('');
                showComment(pageNum);
            }
        },
        error:function(req,st,err){ajaxError(req,st,err,'post/map/comment')},
        complete:function(){postComment=null;}
    });
}

//댓글 삭제하기
let deleteCommentAjax=null;
function deleteComment(commentId){
    if(!confirm('댓글을 삭제하시겠습니까?'))return false;
    else{
        deleteCommentAjax=$.ajax({
            type: 'DELETE',
            url: '/map/comment',
            data: {commentId:commentId},
            cache:false,
            beforeSend:function(){if(deleteCommentAjax!==null)deleteCommentAjax.abort();},
            success: function(result) {
                if(result.result===true){alert('댓글이 삭제되었습니다');showComment(pageNum);}
                else{alert('댓글 삭제 실패하였습니다. 나중에 다시 시도해주세요');}
            },
            error:function(req,st,err){ajaxError(req,st,err,'delete/map/comment')},
            complete:function(){deleteCommentAjax=null;}
        });
    }
}