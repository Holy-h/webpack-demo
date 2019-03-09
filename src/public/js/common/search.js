//검색어 찾기
let searchAjax=null,$input=$('#search-school>input'),$searchList=[$('#search-result>#searchRecent'),$('#search-result>#searchFavorite'),$('#search-result>#searchResult')],nowSearchType=0;
function updateSearchRecent(){
    $.ajax({
        url:'/search/searchRecent',
        type:'GET',
        cache:false,
        data:{},
        success:function(result){$('#searchRecent').html(result)},
        error:function(req,st,err){ajaxError(req,st,err,'get/search/searchRecent')}
    });
}
function updateSearchFavorite(){
    $.ajax({
        url:'/search/searchFavorite',
        type:'GET',
        cache:false,
        data:{},
        success:function(result){$('#searchFavorite').html(result)},
        error:function(req,st,err){ajaxError(req,st,err,'get/search/searchFavorite')}
    });
}
function updateSearchResult(){return updateSearch($input.val());}
function updateSearch(query){
    setTimeout(function(){
        if($input.val()===query)searchAjax=$.ajax({
            url:'/search/searchResult',
            type:'GET',
            cache:false,
            data:{query:query},
            beforeSend:function(){$('#searchResult').html('<div class="search checked" title="학과 검색" style="padding:5px 10px;" onmouseenter="moveSearch($(this))"><i class="fa fa-search" style="line-height:40px;margin-right:10px;"></i> MajorMap 검색&nbsp;|&nbsp;<span>'+query+'</span></div><div style="padding:5px 10px;">검색중입니다.</div>');if(searchAjax!==null) searchAjax.abort();},
            success:function(result){$('#searchResult').html(result)},
            error:function(req,st,err){ajaxError(req,st,err,'get/search/searchResult')},
            complete: function() {searchAjax=null;}
        });
        else if(searchAjax!==null){searchAjax.abort();searchAjax=null;}
    },300);
}
// 0:최근, 1:즐찾, 2:검색어
function showSearch(searchType){
    $('#search-result').show().css({'display':'flex'});
    if(searchType===2) {
        $('#search-result>header').slideUp();
        updateSearchResult($input.val());
    }else{
        $('#search-result>header').slideDown();
        if(searchType===0){
            $('#search-recent').addClass("checked");
            $('#search-favorite').removeClass("checked");
            $('#search-result>#searchFavorite').hide();
            $('#search-result>#searchRecent').show();
            updateSearchRecent();
        }else{
            $('#search-favorite').addClass("checked");
            $('#search-recent').removeClass("checked");
            $('#search-result>#searchRecent').hide();
            $('#search-result>#searchFavorite').show();
            updateSearchFavorite();
        }
    }
    nowSearchType=searchType;
    $searchList[searchType].show();
    $searchList[(searchType+1)%3].hide();
    $searchList[(searchType+2)%3].hide();
}

// 검색결과 방향키로 이동.
function moveSearch($div){
    if($div.length>0){
        $searchList[nowSearchType].children('.checked').toggleClass('checked');
        $div.toggleClass('checked')
    }
}
function gotoSearch($div){
    if($div.data('uname'))window.location.href=mapUrl($div.data('uname'),$div.data('mname'));
    else if($div.attr("href")){window.location.href=$div.attr('href')}
    else window.location.href="/map/searchMap?search="+encodeURI($input.val());
}
function searchEnter(keyCode){
    if(keyCode===38)moveSearch($searchList[nowSearchType].children('.checked').eq(0).prev());
    else if(keyCode===40)moveSearch($searchList[nowSearchType].children('.checked').eq(0).next());
    else if(keyCode===13)gotoSearch($searchList[nowSearchType].children('.checked').eq(0));
    else if(!$input.val()){
        if(keyCode===39)showSearch(1);
        else if(keyCode===37||nowSearchType===2) showSearch(0);
    }
    else if(keyCode<38||keyCode>40)showSearch(2);
}