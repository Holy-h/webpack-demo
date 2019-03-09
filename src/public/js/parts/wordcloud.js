const wordCloudChart=echarts.init(document.getElementById('wordCloud'));
let wordCloudOption = {
    series: [{
        type: 'wordCloud',
        sizeRange: [20, 60],
        gridSize: 10,
        rotationRange : [0, 90],
        rotationStep: 90,
        // textPadding: 30,
        shape: 'square',
        width: '90%',
        height: '90%',
        left: 'center',
        top: 'center',
        drawOutOfBound:false,
        textStyle: {
            normal: {
                fontFamily:'NotoSansKR',
                fontWeight:'bold',
                color: function () {return 'rgba('+Math.round(Math.random()*160)+','+Math.round(Math.random()*160)+','+Math.round(Math.random() * 160)+',1)';}
            },
            emphasis: {shadowBlur: 2, shadowColor: '#F7FE2E'}
        }
    }]
};
function wordCloud(data) {
    wordCloudOption.series[0].data=data.sort(function(a,b){return a.value>b.value?1:-1});
    wordCloudChart.setOption(wordCloudOption);
}