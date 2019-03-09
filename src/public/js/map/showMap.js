// 학교의 단과대로 지도 그리기.
const color_list3 = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074','#fb685b','#92d1d9', '#ffb293','#477056',  '#ffb653', '#f0d3cb','#434549','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074','#fb685b','#92d1d9', '#ffb293','#477056',  '#ffb653', '#f0d3cb','#434549'];
let option = {
    color:color_list3,
    toolbox :{show:true, left:'2.5%', bottom:'2.5%', itemSize:40, feature:{saveAsImage: {icon: 'image://https://www.majormap.net/img/map/camera.png', title:'이미지 저장'}}},
    grid:{left : '0%', right: '0%', top : '60%', bottom: '60%', width:'100%',},
    xAxis:{show: false, min : 'dataMin', max : 'dataMax'},
    yAxis:{show: false, min : 'dataMin', max : 'dataMax'},
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    series:[{
        type: 'graph',
        data: null,
        links: null, // !!
        categories: null,
        roam: true, focusNodeAdjacency: true, label: {show:true, position:'bottom', color:'auto', fontSize:16},
        left: 'center', top: 'middle',
        layout:'force', force:{repulsion:null, gravity:0.00, edgeLength:200}
    }],
    textStyle:{textShadowColor:'#fff',textShadowBlur:5}
};

function showAllLegend($legend){
    let hasClass=$legend.hasClass('checked');
    $('#myDivLegends>.category').each(function(){
        if($(this).hasClass('checked')===hasClass){toggleLegend($(this));}
    });
    $legend.html('전체'+(hasClass?'선택':'해제')).toggleClass('checked');
}

function toggleLegend($legend){
    myChart.dispatchAction({type:'legendToggleSelect',name:$legend.data('cname')});
    $legend.toggleClass('checked');
}

let waypoints=[[null,null,null,null],[null,null,null,null]];
function progressBar(index,isMajor,$elem,property){
    let index2=isMajor?0:1;
    if(waypoints[index2][index]!==null){waypoints[index2][index].destroy();waypoints[index2][index]=null;}
    if(property===null){$elem.addClass('no-data');}
    else{
        $elem.removeClass('no-data');
        waypoints[index2][index]=new Waypoint({
            element:$elem,
            handler:function(){
                let start_value=parseFloat($elem.data('value'));
                $elem.css({width:(Math.round(index<2?property/17:property))+'%'}).data('value',property)
                    .children('.progress-value').children('span').easy_number_animate({
                    start_value:start_value,
                    end_value:property,
                    duration:600
                });
                this.destroy();
                waypoints[index2][index]=null;
            },
            offset:'100%'
        });
    }
}