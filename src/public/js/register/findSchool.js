// 학과 속성 받아오는 api
let searchSchoolAjax=null;
function showSchool(){
    const query=$('#findSchoolInput').val();
    setTimeout(function(){
        if($('#findSchoolInput').val()===query)searchSchoolAjax=$.ajax({
            type: 'GET',
            url: '/search/school',
            cache:false,
            data: {query:query},
            beforeSend:function(){
                if(searchSchoolAjax!==null)searchSchoolAjax.abort();
                else {
                    $('#findSchoolResult').html('<div>검색중...</div>');
                }
            },
            success: function(result){$('#findSchoolResult').html(result);},
            error:function(req,st,err){ajaxError(req,st,err,'get/search/school')},
            complete:function(){searchSchoolAjax=null;}
        });
        else if(searchSchoolAjax!==null){searchSchoolAjax.abort();searchSchoolAjax=null;}
    },300);
}

function showNoSchool(){
    $('#findSchoolResult').html('<div class="color-text2">학교 이름을 입력하세요</div>'+
        '<label class="form-label" style="display:flex;align-items:flex-end"><input style="margin-top:0;" onchange="formLabelChange()"><button type="button" class="btn btn-main-full" onclick="selectSchool($(this).prev().val())">확인</button></label>');
}
function selectSchool(name,id){
    $('#postForm input[name=school]').val(name).addClass('filled');
    $('#postForm input[name=schoolName]').val(name);
    if(id)$('#postForm input[name=schoolID]').val(id);
    $('#findSchoolModal').modal('hide');
}