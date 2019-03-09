var dept_list=[],size_list=[];

//1이면 허브학과, -1이면 섬학과
function isHub(majorName){
    dept_list.forEach(function(item,index){
        if(item===majorName){
            if(size_list[index]>10)return 1;
            else if(size_list[index]<2)return -1;
            else return 0;
        }
    });
    return 10;
}

function drawMajorMap(result) {
    let edges = result.edges;
    let Xn = result.Xn;
    let Yn = result.Yn;
    dept_list = result.dept_list;
    let coll_list = result.coll_list;
    console.log(coll_list);
    //uniq_coll_list = Object.keys(coll_dic);
    let uniq_coll_list = result.uniq_coll_list;
    console.log(uniq_coll_list);
    let node_weight = result.node_weight;
    size_list = node_weight.map(function(x) {return (x) + 15});
    //var size_list = node_weight.map(function(x) {return x + 15}); 변경후

    // var color_list = ['#e6194b','#3cb44b','#ffe119','#0082c8','#f58231','#911eb4','#46f0f0','#f032e6','#d2f53c','#fabebe','#008080','#e6beff','#aa6e28','#fffac8','#800000','#aaffc3','#808000','#ffd8b1','#000080','#808080'];
    // var color_list2= ['#ff1744','#ff616f','#d500f9','#ff5bff','#651fff','#a255ff','#3d5afe','#8187ff','#2979ff','#75a7ff','#00b0ff','#69e2ff','#00e5ff','#1de9b6','#00c853','#76ff03','#b2ff59','#ffff00','#ff6f00','#c43e00','#00695c','#003d33','#534bae','#1a237e','#6a1b9a','#4e342e','#455a64','#0a00b6','#ff9e80','#1b0000'];
    const color_list3 = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074','#fb685b','#92d1d9', '#ffb293','#477056',  '#ffb653', '#f0d3cb','#434549','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074','#fb685b','#92d1d9', '#ffb293','#477056',  '#ffb653', '#f0d3cb','#434549'];
    let nodes = [],rd = Math.round(Math.random()*1000);
    dept_list.forEach(function(dept,idx,arr) {
        let coll_idx = uniq_coll_list.indexOf(coll_list[idx]),
            node= {
                x: Xn[idx],
                y: Yn[idx],
                // x:null,
                // y:null,
                id: idx,
                name: dept,
                category:coll_idx,
                symbolSize: size_list[idx],
                itemStyle: {
                    normal:{
                        //color: color_list[(coll_idx+rd)%20]

                    }
                },
                draggable : true
            };


        nodes.push(node);

    });

    let links = [];

    edges.forEach(function(nds){

        let link= {
            source:nds[0],
            target:nds[1],
            lineStyle: {
                color: 'rgba(0, 0, 0, 1)',
                width: 1
            }
        };
        links.push(link);

    });

    let categories = [];
    let chartLegend='<div class="checked" data-cname="all" onclick="showLegend($(this))">전체해제</div>';
    uniq_coll_list.forEach(function(coll,index){
        categories.push({name:coll});
        chartLegend+='<div class="checked" data-cname="'+coll+'" onclick="showLegend($(this))">' +
            '<div style="background-color:'+color_list3[index]+';"></div>'
            +coll+'' +
            '</div>';
    });
    $('#myDivLegends').html(chartLegend);

    let option = {
        color:color_list3,
        toolbox :{
            show:true,
            left:'2.5%',
            bottom:'2.5%',
            itemSize:40,
            feature:{
                saveAsImage: {
                    icon: 'image://https://www.majormap.net/img/map/camera.png',
                    title:'save image'
                }
            }
        },
        grid:{
            left : '0%',
            right: '0%',
            top : '60%',
            bottom: '60%',
            width:'100%',
        },
        xAxis:{
            show: false,
            min : 'dataMin',
            max : 'dataMax'
        },
        yAxis:{
            show: false,
            min : 'dataMin',
            max : 'dataMax'
        },
        legend: {
            // type:'scroll',
            // orient: 'vertical',
            data: categories,
            // borderRadius:6,
            // top:20,
            // bottom:20,
            // right:10,
            // textStyle:{fontSize:14},
            // backgroundColor:'rgba(255, 255, 255, 1)',
            show: false
        },
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        series : [

            {
                type: 'graph',
                data: nodes, // !!
                links: links, // !!
                categories: categories,
                roam: true,
                focusNodeAdjacency: true,
                label: {
                    show:true,
                    position:'bottom',
                    color:'auto',
                    fontSize:16

                },
                left: 'center',
                top: 'middle',


                layout:'force',
                force:{
                    repulsion:(dept_list.length)*2,
                    gravity:0.00,
                    edgeLength:200

                }

            }
        ]
    };

    myChart.setOption(option);
    myChart.on('click', function (params) {
        // 노드 - 엣지 구분
        if (params.name[0] >= '9') {
            showMajor(uName,params.name,true);
        }
    });
}

$(document).ready(function(){
    $(window).on('resize',function(){
        myChart.resize();
    })
});

let uniq_coll_list=[];
function showLegend($legend){
    if($legend.data('cname')==="all"){
        let hasClass=$legend.hasClass('checked');
        uniq_coll_list.forEach(function(item){
            myChart.dispatchAction({type:hasClass?'legendUnSelect':'legendSelect',name:item});
        });
        $legend.html('전체'+(hasClass?'선택':'해제'));
        if(hasClass)$('#myDivLegends>div').removeClass('checked');
        else $('#myDivLegends>div').addClass('checked');
    }
    else{
        myChart.dispatchAction({type:'legendToggleSelect',name:$legend.data('cname')});
        $legend.toggleClass('checked');
    }
}