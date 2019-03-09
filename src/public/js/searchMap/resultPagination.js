
// 결과 현재페이지, 전체페이지, 결과갯수
var now=1,total=1;

// 페이지 이동
function resultScroll(page){
    now=page;
    if(now<=1){now=1;}
    if(now>=total){now=total;}
    $('#page-now').val(now);
    $('#results').animate({scrollLeft:$('#results').innerWidth()*(now-1)},300);
}
//전체페이지 갯수 계산.
function initTotalPage(){
    let temp=total;
    total=Math.ceil($('#results').prop('scrollWidth')/$('#results').innerWidth());
    $('#page-total').easy_number_animate({
        start_value:temp,
        end_value:total,
        duration:500,
        delimiter:''
    });
}

//모바일버전에서 섹션 이동. 1은 필터, 2는 결과. 3은 지도. 결과로 이동하면 전체페이지계산하고 페이지이동.
let $main=$('main').eq(0),$window=$(window),$moveSection=$('#moveSection'),$moveSectionBtn=$('#moveSection>.btn').eq(1);
function moveSection(selector){
    // switch(selector){
    //     case 1:$('#filterSection').fadeIn().css({display:'flex'});$('#resultSection').hide();$('#naverMap').hide();break;
    //     case 2:$('#resultSection').fadeIn().css({display:'flex'});$('#filterSection').hide();$('#naverMap').hide();
    //         initTotalPage();resultScroll(now);break;
    //     case 3:$('#naverMap').fadeIn().css({display:'flex'});$('#filterSection').hide();$('#resultSection').hide();break;
    // }
    switch(selector){
        case 1:
            $main.animate({scrollLeft:0},300);
            $moveSection.removeClass('mini');
            $moveSectionBtn.html('<div onclick="moveSection(2)">조건에 맞는 학과 찾아보기</div>');
            break;
        case 2:
            $main.animate({scrollLeft:$window.innerWidth()},300);
            $moveSection.addClass('mini');
            $moveSectionBtn.html('<div onclick="moveSection(1)">필터</div><div style="flex:0 0 1px;border-left:1px solid #fff"></div><div onclick="moveSection(3)">지도</div>');
            break;
        case 3:
            $main.animate({scrollLeft:$window.innerWidth()*2},300);
            $moveSection.addClass('mini');
            $moveSectionBtn.html('<div onclick="moveSection(1)">필터</div><div style="flex:0 0 1px;border-left:1px solid #fff"></div><div onclick="moveSection(2)">검색</div>');
            break;
    }
}
