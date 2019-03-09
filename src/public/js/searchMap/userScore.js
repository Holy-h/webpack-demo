function showGrade(grade){
    let grade1=[$('#userScoreModal input[name=과학탐구], #userScoreModal input[name=사회탐구]').parent().parent().parent()],
        grade2=[$('#userScoreModal input[name=수학등급]').parent(),$('#userScoreModal input[name=탐구1], #userScoreModal input[name=탐구2], #userScoreModal input[name=제2외국어]').parent().parent().parent(),$('#userScoreModal input[name=탐구선택]').parent().parent().parent().parent()];
    if(grade===1){
        grade1.forEach(function($item){$item.slideDown()});
        $('#userScoreModal input[name=과학탐구], #userScoreModal input[name=사회탐구]').prop('disabled',false);
        grade2.forEach(function($item){$item.slideUp()});
        $('#userScoreModal input[name=수학등급], #userScoreModal input[name=탐구1], #userScoreModal input[name=탐구2], #userScoreModal input[name=제2외국어], #userScoreModal input[name=탐구선택], #userScoreModal select[name=제2외국어과목], #userScoreModal select[name=탐구1과목], #userScoreModal select[name=탐구2과목]').prop('disabled',true);
    }else{
        grade1.forEach(function($item){$item.slideUp()});
        $('#userScoreModal input[name=과학탐구], #userScoreModal input[name=사회탐구]').prop('disabled',true);
        grade2.forEach(function($item){$item.slideDown()});
        $('#userScoreModal input[name=수학등급], #userScoreModal input[name=탐구1], #userScoreModal input[name=탐구2], #userScoreModal input[name=제2외국어], #userScoreModal input[name=탐구선택], #userScoreModal select[name=제2외국어과목], #userScoreModal select[name=탐구1과목], #userScoreModal select[name=탐구2과목]').prop('disabled',false);
    }
}
function changeTamgu(){
    const tamguSelect=$('#userScoreModal select[name=탐구1과목],#userScoreModal select[name=탐구2과목]');
    tamguSelect.html('');
    if($('#userScoreModal input[name=탐구선택]:checked').val()==='사회'){
        ['한국지리','윤리와사상','생활과윤리','사회문화','법과정치','경제','세계사','동아시아사','세계지리'].forEach(function(item){
            tamguSelect.append('<option value="'+item+'">'+item+'</option>');
        });
    }else{
        ['물리1','물리2','화학1','화학2','생명과학1','생명과학2','지구과학1','지구과학2'].forEach(function(item){
            tamguSelect.append('<option value="'+item+'">'+item+'</option>');
        });
    }
}
let userScoreAjax=null;
const $checkScore=$('#filterSection input[name=score]');
function submitScore(isReset){
    userScoreAjax=$.ajax({
        type: 'POST',
        url: '/user/score',
        cache:false,
        data:$('#userScoreForm').serialize(),
        beforeSend:function(){
            if(userScoreAjax!==null)userScoreAjax.abort();
            postLog(13,"점수입력",{additionalData:$('#userScoreForm').serialize()},function(){});
        },
        success: function(result) {
            if(result.result===true){
                alert("점수가 "+(isReset?'초기화':'저장')+"되었습니다.");
                $checkScore.val(isReset?'':result.avg);
                checkScore(!isReset);
                $('#userScoreModal').modal('hide');
                submitForm();
            }
        },
        error:function(req,st,err){ajaxError(req,st,err,'post/user/score')},
        complete:function(){userScoreAjax=null;}
    });
}
function checkScore(isCheck){
    if(isCheck&&!$checkScore.val()){$checkScore.prop('checked',false);$('#userScoreModal').modal('show');console.log(1)}
    else{$checkScore.prop('checked',isCheck);submitForm();$checkScore.prev().html('내 점수'+(isCheck?'에 맞는 학과 찾기':' 입력'));console.log(2)}
}
function resetScore(){
    $('#userScoreForm input[type=number], #userScoreForm select').val('');
    $('#userScoreForm input[type=radio]').prop('checked',false);
    showGrade(2);
    submitScore(true);
}