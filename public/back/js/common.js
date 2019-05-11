
//进度条效果
$(document).ajaxStart(function () {

    //第一个ajax请求发送时，进度条开始
    NProgress.start();

});
$(document).ajaxStop(function () {

    NProgress.done();
    
});

$(function () {

 //点检侧边导航.展开导航
    $(".category").on("click",function () {

        $(".child").stop().slideToggle();

    })

    //点击导航菜单，导航隐藏
    $(".icon-menu").on("click",function () {

        $(".aside").stop().toggleClass("hidemenu");
        $(".main").stop().toggleClass("hidemenu");
        $('.topbar').stop().toggleClass("hidemenu");
        
    })

    //点击退出按钮，模态框出现
    $(".icon-logout").on("click",function () {
        $('#Modal').modal('show')

    })

});
