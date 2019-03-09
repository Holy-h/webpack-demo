//행정구역 18개 경계선 불러오기.
var regionGeoJson = [], loadCount = 0;
for (let i = 1; i < 18; i++) {
    $.ajax({
        url: '/data/region' + (i<10?'0'+i:i) + '.json',
        success: function(idx) {
            return function(geojson) {
                regionGeoJson[idx] = geojson;
                loadCount++;
                if (loadCount === 17) startDataLayer();
            }
        }(i - 1)
    });
}
//지도의 중심은 서울.
const map = new naver.maps.Map(document.getElementById('naverMap'), {
    zoom: 7,
    center: new naver.maps.LatLng(37.5768267,126.9813165),
    zoomControl:true,
    zoomControlOptions: {
        position: 4,
        style: naver.maps.ZoomControlStyle.SMALL
    },
});

//네이버지도 행정구역 표시하고 클릭/마우스오버효과 넣기.
const tooltip = $('<div style="position:absolute;z-index:101;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>');
tooltip.appendTo(map.getPanes().floatPane);

// 행정구역 불러왔으면 보여준다.
function startDataLayer() {
    map.data.setStyle(function(feature) {
        //기본은 파란색.. 칠은 투명.
        var styleOptions = {
            fillColor: '#294084',
            fillOpacity: 0.0001,
            strokeColor: '#294084',
            strokeWeight: 2,
            strokeOpacity: 0.4
        };
        // 행정구역[focus]==true면 빨강으로 칠한다. (밑에 클릭하면 feature[focus]=true 만드는 함수있음)
        if (feature.getProperty('focus')) {
            // 체크박스에 체크한다. ajax로 region도 같이 보내려고 만들었음.
            // 아이디에 한글 넣는거 안좋아해서 네이버코드로 만들었음. 강원도는 01, 경기도는 02, ... public > data > region01.json 참조.
            $('#region-'+feature.getProperty('navercode')).prop("checked", true);
            styleOptions.fillOpacity = 0.6;
            styleOptions.fillColor = '#e62739';
            styleOptions.strokeColor = '#e62739';
            styleOptions.strokeWeight = 4;
            styleOptions.strokeOpacity = 1;
        } else{
            // focus 풀리면 체크박스 해제
            $('#region-'+feature.getProperty('navercode')).prop("checked", false);
        }
        return styleOptions;
    });

    // 경계선 그리기.
    regionGeoJson.forEach(function(geojson) {
        map.data.addGeoJson(geojson);
    });

    // 클릭하면 focus 넣고 (위에 focus에 따라 region바뀌는 함수 있음) ajax보냄.
    map.data.addListener('click', function(e) {
        let feature = e.feature;
        feature.setProperty('focus', ~feature.getProperty('focus'));
        submitForm();
    });

    //마우스 올리면 파란색으로 투명하게 칠했던거 투명도 진하게 바꿈.
    //지역이름 툴팁보여줌.
    map.data.addListener('mouseover', function(e) {
        var feature = e.feature,
            regionName = feature.getProperty('area1');

        tooltip.css({
            display: '',
            left: e.offset.x,
            top: e.offset.y
        }).text(regionName);

        map.data.overrideStyle(feature, {
            fillOpacity: 0.6,
            strokeWeight: 4,
            strokeOpacity: 1
        });
    });

    // 마우스 안올리면 지역이름 툴팁 숨기고 진하게 칠했던거 원상복구
    map.data.addListener('mouseout', function(e) {
        tooltip.hide().empty();
        map.data.revertStyle();
    });
}
function openInfoWindow(marker){
    map.panTo(marker.position);
    if(!marker.infoWindow.content){
        let majorString='';
        marker.majors.forEach(function(item){majorString+="<br><a class='text14' href='"+mapUrl(marker.title,item.name)+"'>"+item.name+"</a>";});
        marker.infoWindow.setContent('<div style="padding:5px 10px;max-height:200px;overflow-y:auto;overflow-x:hidden"><a href="'+mapUrl(marker.title)+'" class="tet16 bold">'+marker.title+'</a>'+majorString+'</div>');
    }
    marker.infoWindow.open(map,marker);
    marker.setZIndex(120);
    markerSelected=marker;
}