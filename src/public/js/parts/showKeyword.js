// 학과 속성 받아오는 api
let showKeywordAjax=null;
let $content=$('#keywordModal>div>div');
function showKeyword(keyword,color){
    showKeywordAjax=$.ajax({
        type: 'GET',
        url: '/search/keyword',
        cache:false,
        data: {search:keyword,color:color},
        beforeSend:function(){
            if(showKeywordAjax!==null)showKeywordAjax.abort();
            else {
                $content.html('<img src="/img/majorMap/honghak.png" style="height:180px;margin-top:auto;margin-bottom:20px;"><div style="margin-top:0;margin-bottom:auto" class="text24">'+keyword+' 검색중...</div>');
                $('#keywordModal').modal('show');
            }
        },
        success: function(result){$content.html(result);},
        error:function(req,st,err){ajaxError(req,st,err,'get/search/keyword')},
        complete:function(){showKeywordAjax=null;}
    });
}