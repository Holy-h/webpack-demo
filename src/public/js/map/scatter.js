var resizeId;

window.onresize = function() {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 150);
}

function doneResizing(){

  Plotly.relayout('myDiv', {
    width: 0.9 * window.innerWidth,
    height: 0.9 * window.innerHeight
  })

}





function drawMajorMap(result) {
  var myPlot = document.getElementById('myDiv');
  var Xe = result.Xe;
  var Ye = result.Ye;
  var Xn = result.Xn;
  var Yn = result.Yn;
  var dept_list = result.dept_list;
  var coll_list = result.coll_list;
  var coll_dic = result.coll_dic;
  var uniq_coll_list = [];


  $.each(coll_list, function(i, el){ if($.inArray(el, uniq_coll_list) === -1) uniq_coll_list.push(el); });

  var node_weight = result.node_weight;
  var size_list = node_weight.map(function(x) {return ((x)*75) + 18});
  //var style_list = uniq_coll_list.map(function(v,i){ return {target: v, value: {marker: {color: 'hsl('+(360/(uniq_coll_list.length-1)*i)+',50%,50%)'}}}});

  var trace_edge = {
    x: Xe,  
    y: Ye,
    mode: 'lines',
    line: { color:'rgb(125,125,125)', width: 0.65, opacity:0.5 },
    hoverinfo : 'none',
    name : '유사 학과'
  };

  var data = [];
  data.push(trace_edge);


  for (var coll in coll_dic) {

    depts = coll_dic[coll];
    Xn_coll = [];
    Yn_coll = [];
    size_list_coll = [];
    dept_list_coll = []
    opacity_list_coll = [];

    depts.forEach(dept => {

      idx = dept_list.indexOf(dept);

      Xn_coll.push(Xn[idx]);
      Yn_coll.push(Yn[idx]);
      size_list_coll.push(size_list[idx]);
      dept_list_coll.push(dept);
      opacity_list_coll.push(0.65);

   });

   var trace_node = {
    type: 'scatter',
    x: Xn_coll,
    y: Yn_coll,
    mode: 'markers+text',
    marker: {size: size_list_coll, line: {width: 1}, opacity: opacity_list_coll,color: 'hsl('+(360/(uniq_coll_list.length-1)*uniq_coll_list.indexOf(coll))+',50%,50%)'},
    text: dept_list_coll,
    textfont: {size : 8},
    textposition: 'bottom center',
    name: coll,
    hoverinfo: 'text'
  };

  
  data.push(trace_node);



  }






  // var trace_node = {
  //   type: 'scatter',
  //   x: Xn,
  //   y: Yn,
  //   mode: 'markers+text',
  //   marker: {size: size_list, line: {width: 1}, opacity: 1},
  //   text: dept_list,
  //   textfont: {size : 8},
  //   textposition: 'bottom center',
  //   transforms: [{type: 'groupby', groups: coll_list,styles: style_list }],
  //   name: '단과대',
  //   hoverinfo: 'text'
  // };

  // var data = [ trace_edge,trace_node ];
    
  var layout = {
    xaxis: {zeroline: false, gridwidth: 2, autorange:true, showgrid:false, showline:false, showticklabels:false, ticks:''},
    yaxis: {zeroline: false, gridwidth: 2, autorange:true, showgrid:false, showline:false, showticklabels:false, ticks:''},
    hovermode: 'closest',
    showlegend: true,
    width: 0.9 * window.innerWidth,
    height: 0.9 * window.innerHeight,
    //title:'Major Map',
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
   }
    

  Plotly.newPlot('myDiv', data, layout,{displayModeBar: false});

   var origin_size = 0;

  myPlot.on('plotly_hover',function(data){
    var pn ='',
        tn ='',
        sizes = [];
    for (var i=0; i<data.points.length;i++){
      pn = data.points[i].pointNumber;
      tn = data.points[i].curveNumber;
      sizes = data.points[i].data.marker.size;
      colors = data.points[i].data.marker.color;
      opas = data.points[i].data.marker.opacity;
  
    }
    origin_size = sizes[pn]
    sizes[pn] = origin_size + 10
    opas[pn] = 1



    //var update ={'marker':{size:sizes,line: {width: 1}, opacity: 1,color:colors}};
    //Plotly.restyle('myDiv',update,[tn]);
    Plotly.animate('myDiv',{
      data:[{marker:{size:sizes,line: {width: 1}, opacity: opas, color:colors}}],
      traces: [tn],
      layout:{}
    },{transition:{duration:200,easing:'cubic-in-out'}})

    });



    myPlot.on('plotly_unhover',function(data){
      var pn ='',
          tn ='',
          sizes = [];
      for (var i=0; i<data.points.length;i++){
        pn = data.points[i].pointNumber;
        tn = data.points[i].curveNumber;
        sizes = data.points[i].data.marker.size;
        colors = data.points[i].data.marker.color;
        opas = data.points[i].data.marker.opacity;
    
      }
      sizes[pn] = origin_size
      opas[pn] = 0.65
  
  
      //var update ={'marker':{size:sizes,line: {width: 1}, opacity: 1,color:colors}};
      //Plotly.restyle('myDiv',update,[tn]);
      Plotly.animate('myDiv',{
        data:[{marker:{size:sizes,line: {width: 1}, opacity: opas,color:colors}}],
        traces: [tn],
        layout:{}
      },{transition:{duration:200,easing:'cubic-in-out'}})
      });
    
    // for(var i=0; i < data.points.length; i++){
    //   pn = data.points[i].pointNumber;
    //   tn = data.points[i].curveNumber;
    //   sizes = data.points[i].data.marker.size;
    // };

    // sizes[pn] = 15;

    // var update = {'marker': {size : sizes}};
    // Plotly.restyle('myDiv', update, 1);





  };
