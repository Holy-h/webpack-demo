$(document).ready(function(){
    setTutorial();
    $(window).on('resize',function(){setTutorial()})
});
function setTutorial(){
    if($(window).innerWidth()>1900){
        $('#tutorialModal').modal('show').children('img').each(async function(){
            let $target=$($(this).data('target')),direction={};
            if($(this).data('top')!==undefined){direction.top=await $target.offset().top+parseInt($(this).data('top'));}
            if($(this).data('left')!==undefined){direction.left=await $target.offset().left+parseInt($(this).data('left'));}
            if($(this).data('bottom')!==undefined){direction.top=await $target.offset().top+$target.outerHeight()+parseInt($(this).data('bottom'));}
            if($(this).data('right')!==undefined){direction.left=await $target.offset().left+$target.outerWidth()+parseInt($(this).data('right'));}
            $(this).css(direction);
        });
    }
}