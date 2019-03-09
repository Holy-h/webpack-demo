function openResultMajor(uName){
    let marker=markerJSON[uName],resultMajorString='';
    $('#resultLength>i').fadeIn();
    $('#schoolName').html(uName).parent().attr('href',mapUrl(uName));
    marker.majors.forEach(function(item,index){
        resultMajorString+='<div class="outer-box">' +
            '  <div class="section-box pointer" onclick="if(!$(event.target).closest(\'.favcheck\').length)window.location.href=mapUrl(\''+uName+'\',\''+item.name+'\')">' +
            '      <div class="text16">'+item.name+'</div>' +
            '      <div class="favcheck'+(item.isFav?' checked':'')+'" data-uname="'+uName+'" data-mname="'+item.name+'" onclick="favCheck($(this));markerJSON[\''+item.name+'\'].isFav='+!item.isFav+'"><i class="fa fa-star"></i></div>'+
            '    </div>' +
            '  </div>'
    });
    $('#resultsMajorSection').show().html(resultMajorString).animate({left:0},function(){
        $('#resultsMajorSection').css({'overflow-x':'visible'});
        $('#resultsSchoolSection').hide(function(){
            initTotalPage();resultScroll(1);
            openInfoWindow(marker);
        });
    });

    //주소창 url 바꾸고 히스토리에 추가.
    if (typeof (history.pushState) !== undefined && (history.state.data==='closed' || history.state.uName!==uName)){history.pushState({data:'opened',uName:uName}, uName+' 검색 - Major Map','/map/searchMap');}
    $(document).prop('title', uName+' 검색 - Major Map');
}
function closeResultMajor(){
    $('#resultLength>i').fadeOut();
    $('#schoolName').html('검색결과').parent().removeAttr('href');
    $('#resultsSchoolSection').show(function(){
        $('#resultsMajorSection').css({'overflow-x':'hidden'}).animate({left:'100%'},function(){
            $('#resultsMajorSection').hide();initTotalPage();resultScroll(1);
        });
    });

    if (typeof (history.pushState) !== undefined && history.state.data==='opened'){history.pushState({data:'closed'}, '검색 - Major Map','/map/searchMap');}
    $(document).prop('title','학과 검색 - Major Map');
}