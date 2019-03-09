let mName=null,uName=null,mID=null;
// 학교+학과 입력받고, 학교가 달라졌으면 학과지도 새로 그리고, 학과검색이면 학과속성보여줌
function showMajor(univName,majorName,isPush){
    $('#search-result').slideUp();
    $('#keywordModal').modal('hide');
    $('#preparing').fadeOut();
    $('body').removeClass('modal-open');
    // 애널리틱스 추가.
    gtag('set','page',mapUrl(univName,majorName));
    gtag('send','pageview');
    // 주소창 url 바꾸고 히스토리에 추가.
    const title=univName+(majorName!==null?' '+majorName:'');
    if (typeof (history.pushState) !== undefined){
        if(isPush)history.pushState({page:'map',mID:mID,mName:majorName,uName:univName},title,mapUrl(univName,majorName));
        else history.replaceState({page:'map',mID:mID,mName:majorName,uName:univName},title,mapUrl(univName,majorName));
        $(document).prop('title',title);
    }
    getUniv(univName,majorName);
    getMajor(univName,majorName);
}
// 학과 속성 받아오는 api
let getMajorAjax=null;
function getMajor(univName,majorName){
    if(majorName!==null){
        getMajorAjax=$.ajax({
            type: 'GET',
            url: '/api/detail',
            cache:false,
            data: {univname:univName, majorname: majorName},
            beforeSend:function(){if(getMajorAjax!==null)getMajorAjax.abort();},
            success: function(result){
                if(!isUser){$loginModal.modal({backdrop: 'static', keyboard: false, show: true});}
                if(result.result===false){showPreparing(univName+' '+majorName);mName=null;mID=null;}
                else if(result.result===null){alert(result.message);mName=null;mID=null;}
                else{
                    mID=result.major._id;mName=majorName;
                    // 학과속성보이기.
                    $('.before-major').slideDown(function(){wordCloudChart.resize();}).css({display:'flex'});
                    $.ajax({
                        type: 'GET',
                        url: '/map/major/title',
                        cache:false,
                        data:{mID:mID},
                        beforeSend:function(){$('#majorName').css({opacity:0.5});},
                        success:function(result){$('#majorName').html(result);},
                        error:function(req,st,err){ajaxError(req,st,err,'map/major/title')},
                        complete:function(){$('#majorName').css({opacity:1});}
                    });
                    $.ajax({
                        type: 'GET',
                        url: '/map/major/book',
                        cache:false,
                        data:{mID:mID},
                        beforeSend:function(){$('#book').parent().parent().css({display:'flex',opacity:0.5});},
                        success:function(result){if(result.result===false)$('#book').parent().parent().css({display:'none'});else $('#book').trigger('replace.owl.carousel', result).trigger('refresh.owl.carousel');},
                        error:function(req,st,err){ajaxError(req,st,err,'map/major/book')},
                        complete:function(){$('#book').parent().parent().css({opacity:1});}
                    });
                    $.ajax({
                        type: 'GET',
                        url: '/map/major/similarMajors',
                        cache:false,
                        data:{mID:mID},
                        beforeSend:function(){$('#similar-major').parent().parent().css({opacity:0.5});},
                        success:function(result){$('#similar-major').trigger('replace.owl.carousel', result).trigger('refresh.owl.carousel');},
                        error:function(req,st,err){ajaxError(req,st,err,'map/major/similarMajors')},
                        complete:function(){$('#similar-major').parent().parent().css({opacity:1});}
                    });
                    $.ajax({
                        type: 'GET',
                        url: '/map/major/highschoolSubjects',
                        cache:false,
                        data:{mID:mID},
                        beforeSend:function(){$('#subject').parent().parent().css({opacity:0.5});},
                        success:function(result){$('#subject').trigger('replace.owl.carousel', result).trigger('refresh.owl.carousel');},
                        error:function(req,st,err){ajaxError(req,st,err,'map/major/highschoolSubjects')},
                        complete:function(){$('#subject').parent().parent().css({opacity:1});}
                    });
                    $.ajax({
                        type: 'GET',
                        url: '/map/major/wordclouds',
                        cache:false,
                        data:{mID:mID},
                        beforeSend:function(){$('#wordCloud').parent().animate({opacity:0.5});},
                        success:function(result){wordCloud(result.wordcloud);},
                        error:function(req,st,err){ajaxError(req,st,err,'map/major/wordclouds')},
                        complete:function(){$('#wordCloud').parent().animate({opacity:1});}
                    });

                    //학과속성 그래프. 속성 둘 다 없으면 섹션을 숨겨버린다.
                    $('.progressMajor').each(function(index){progressBar(index,true,$(this),result.majorProperties[index]);});

                    if(result.majorProperties[0]===null&&result.majorProperties[1]===null)$('#property-price').slideUp(); else $('#property-price').slideDown();
                    if(result.majorProperties[2]===null&&result.majorProperties[3]===null)$('#property-tmi').slideUp(); else $('#property-tmi').slideDown();

                    //댓글 in... 수정.
                    $('#commentedIn').val('in '+univName+' '+majorName);

                    //스크롤!
                    $('html,body').animate({scrollTop:window.innerHeight-90},300);
                }
            },
            error:function(req,st,err){ajaxError(req,st,err,'get/api/detail')},
            complete:function(){getMajorAjax=null;}
        });
    }else{
        if(getMajorAjax!==null)getMajorAjax.abort();
        // 학과속성숨기기
        $('.before-major').slideUp();
        //맨 위에 이름 바꿈.
        $.ajax({
            type: 'GET',
            url: '/map/major/title',
            cache:false,
            data:{uName:univName},
            beforeSend:function(){$('#majorName').css({opacity:0.5});},
            success:function(result){$('#majorName').html(result);},
            error:function(req,st,err){ajaxError(req,st,err,'map/major/title')},
            complete:function(){$('#majorName').css({opacity:1});}
        });
        //댓글 in... 수정.
        $('#commentedIn').val('in '+univName);
        //스크롤!
        $('html,body').animate({scrollTop:0},300);
    }
}
let getUnivAjax=null;
function getUniv(univName,majorName){
    if(uName===univName)return;
    uName=univName;
    getUnivAjax=$.ajax({
        type: 'GET',
        url: '/api/school',
        cache:false,
        data: {univname:univName,majorname:majorName},
        beforeSend:function(){
            if(getUnivAjax!==null)getUnivAjax.abort();
            else{$('#myDivLoading').fadeIn();}
        },
        success: function(result){
            if(result.result!==true){
                showPreparing(univName);
                getUnivAjax=null;
            } else{
                // 검색창에 학교이름/학과갯수 채워넣음.
                $('#search-school>input').val(univName+' ('+result.dept_list.length+'개 학과)');

                $('.progressUniv').each(function(index){progressBar(index,false,$(this),result.attrs[index]);});

                let nodes = [];
                result.dept_list.forEach(function(dept,idx) {
                    nodes.push({x: result.Xn[idx], y: result.Yn[idx], id: idx, name: dept, category:result.uniq_coll_list.indexOf(result.coll_list[idx]), symbolSize: result.node_weight.map(function(x) {return (x) + 15})[idx], draggable : true});
                });

                let links = [];
                result.edges.forEach(function(nds){links.push({source:nds[0], target:nds[1], lineStyle: {color: 'rgba(0, 0, 0, 1)',width: 1}});});

                let categories = [];
                let chartLegend='<div class="checked background-main radius6 color-text4" data-cname="all" onclick="showAllLegend($(this))" style="text-align:center">전체해제</div>';
                result.uniq_coll_list.forEach(function(coll,index){
                    categories.push({name:coll});
                    chartLegend+='<div class="checked category" data-cname="'+coll+'" onclick="toggleLegend($(this))"><div style="background-color:'+color_list3[index]+';"></div>' +coll+ '</div>';
                });
                $('#myDivLegends').html(chartLegend);

                option.legend = {data: categories, show: false};
                option.series[0].data=nodes;
                option.series[0].links=links;
                option.series[0].categories=categories;
                option.series[0].force.repulsion=result.dept_list.length*2;

                myChart.setOption(option);
            }
        },
        error:function(req,st,err){ajaxError(req,st,err,'get/api/school')},
        complete:function(){
            $('#myDivLoading').fadeOut();
            getUnivAjax=null;
        }
    });
}
function showPreparing(string){
    $('#preparing .preparing-name').eq(0).html(appendHangeul(string,'은','는'));
    $('#preparing .preparing-name').eq(1).html(appendHangeul(string,'을','를'));
    $('#preparing').fadeIn().css({display:'flex'});
    $('body').addClass('modal-open');
    postLog(12,'준비중인 '+(mName!==null?'학과':'학교')+' 접속',{university:uName,major:mName},function(){});
}
function requestMajor(){
    postLog(12,'준비중인 '+(mName!==null?'학과':'학교')+' 요청',{university:uName,major:mName},function(){
        alert("요청되었습니다!");
        window.history.back();
    });
}