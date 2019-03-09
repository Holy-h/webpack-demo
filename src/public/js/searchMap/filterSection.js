let markerJSON={},totalResults=0;

//ajax보냄.
let searchMapAjax=null;
let markerSelected=null;
function submitForm(){
    searchMapAjax=$.ajax({
        type: 'POST',
        url: '/map/searchMap',
        cache:false,
        data:$('#postForm').serialize(),
        beforeSend:function(){$('#resultSection, #naverMap').animate({opacity:0.7});if(searchMapAjax!==null)searchMapAjax.abort();},
        success: function(result) {
            if(markerSelected)markerSelected.infoWindow.close();markerSelected=null;

            $('#resultSection, #naverMap').animate({opacity:1});
            // 학과 초기화.
            // resultSection에 보여줄 결과.
            let resultString='';
            // 지도에 표시한 마커들 없애고
            for(let key in markerJSON){markerJSON[key].setMap(null);}
            // 마커 모아두는 json 초기화.
            markerJSON={};totalResults=0;

            const schools=Object.keys(result).sort();
            const schoolsZindex=Object.keys(result).sort(function(a,b){return result[a].y<result[b].y?1:-1});
            for(let i=0;i<schools.length;i++){
                let markerW=22*map.zoom/3,markerH=35*map.zoom/3;
                let school=schools[i],resultSchool=result[school],item={
                    title:school,
                    position:new naver.maps.LatLng(resultSchool.y, resultSchool.x),
                    map:map,
                    infoWindow:new naver.maps.InfoWindow(),
                    majors:resultSchool.majors.sort(function(a,b){return a.name>b.name?1:-1}),
                    z:schoolsZindex.indexOf(school),
                    zIndex:schoolsZindex.indexOf(school),
                    icon:{
                        content: '<div class="marker" style="width:'+markerW+'px;height:'+markerH+'px">' +
                        '<div class="marker-img background-contain-center"></div>'+
                        '<div class="marker-logo background-cover-center" style="width:'+markerW+'px;height:'+markerW+'px;background-image:url('+logoUrl(school)+')"></div>' +
                        '<div class="marker-pulse"></div>' +
                        '<div class="marker-selected"></div>' +
                        '</div>',
                        size: new naver.maps.Size(markerW,markerH),
                        origin: new naver.maps.Point(0, 0),
                        anchor: new naver.maps.Point(markerW/2,markerH)
                    }
                };
                let marker=new naver.maps.Marker(item);

                naver.maps.Event.addListener(marker,'click',function(){
                    if(marker.infoWindow.getMap()){
                        markerSelected.setZIndex(markerSelected.z);
                        markerSelected=null;
                        marker.infoWindow.close();
                    }
                    else{
                        openInfoWindow(marker);
                        openResultMajor(item.title);
                    }
                });
                naver.maps.Event.addListener(marker,'mouseover',function(){
                    marker.setZIndex(120);
                });
                naver.maps.Event.addListener(marker,'mouseout',function(){
                    marker.setZIndex(marker.z);
                });

                markerJSON[item.title]=marker;
                resultString+='<div class="outer-box">' +
                    '  <div class="section-box pointer" onclick="openResultMajor(\''+item.title+'\')">' +
                    '      <div class="text16">'+item.title+'</div>' +
                    '      '+item.majors.length+'개 학과'+
                    '       <i class="fa fa-chevron-right"></i>'+
                    '    </div>' +
                    '  </div>';
                totalResults+=item.majors.length;
            }

            naver.maps.Event.addListener(map,'zoom_changed',function(zoom){
                let markerW=22*zoom/3,markerH=35*zoom/3;
                for(let key in markerJSON){
                    markerJSON[key].setIcon({
                        content: '<div class="marker" style="width:'+markerW+'px;height:'+markerH+'px" onmouseover="$(this).parent(\'div\').css({\'z-index\':1})" onmouseout="$(this).parent(\'div\').css({\'z-index\':0})">' +
                        '<div class="marker-img background-contain-center"></div>'+
                        '<div class="marker-logo background-cover-center" style="width:'+markerW+'px;height:'+markerW+'px;background-image:url('+logoUrl(markerJSON[key].title)+')"></div>' +
                        '<div class="marker-pulse"></div>' +
                        '<div class="marker-selected"></div>' +
                        '</div>',
                        size: new naver.maps.Size(markerW,markerH),
                        origin: new naver.maps.Point(0, 0),
                        anchor: new naver.maps.Point(markerW/2,markerH)
                    })
                }
                // $('.marker-img').css({width:markerW,height:markerH}).on('mouseover',function(){$(this).css({width:markerW*1.5,height:markerH*1.5})}).on('mouseout',function(){$(this).css({width:markerW,height:markerH})});
            });

// resultSection에 보여줄 결과.
            if(schools.length===0){
                resultString='<div class="text18 text-center" style="margin:auto">학과를 찾을 수 없습니다<br>처음부터 다시 찾아볼까요?' +
                    '<div class="d-flex btn btn-main3-full text18 align-items-center" style="margin:15px auto 0;width:200px;height:40px;position:relative" onclick="resetCheck();">' +
                    '<i class="fa fa-repeat" style="margin-left:15px;transform:rotate(-90deg)"></i>' +
                    '<div style="flex:auto;margin-right:15px;">초기화</div>' +
                    '</div>' +
                    '</div>'
            }
            $('#resultsSchoolSection').html(resultString);

//학과 결과 닫기.(학교 결과 보여주기)
            closeResultMajor();

// pc화면이면 바로 전체 페이지 계산하고 페이지이동.
            if($(window).innerWidth()>992){
                initTotalPage();
                resultScroll(now);
            }
        },
        error:function(req,st,err){ajaxError(req,st,err,'post/map/searchMap')},
        complete:function(){searchMapAjax=null;}
    });
}
//선택과목 하나 선택했으면 다른 하나 disabled+hide. 초기화하면 show


function resetCheck(){
    // 전체 선택. 나머지 해제
    $('#filterSection [name=keyword]').remove();
    $('#resultKeyword').remove();
    $('#filterSection input:not([name])').prop('checked',true);
    $('#filterSection input[name]').prop('checked',false);

    // 행정구역 체크해제.. 어떻게 하는걸까..
    map.data._features.forEach(function(feature){feature.setProperty('focus',false)});
    submitForm();
}