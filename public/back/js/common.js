
//进度条效果
$(document).ajaxStart(function () {

    //第一个ajax请求发送时，进度条开始
    NProgress.start();

});
$(document).ajaxStop(function () {

    NProgress.done();
    
});

//登录拦截功能，判断当前用户是否登录，如果用户已经登录，则让用户继续浏览页面，如果用户没用登录，则拦截到登录页
//判断当前页是否是登录页，如果是登录页，就不用进行登录拦截
if(location.href.indexOf("login.html")=== -1)
{
    $.ajax({
        type:"get",
        url:"/employee/checkRootLogin",
        dataType: "json",
        success:function (info) {

            if(info.success)
            {
                console.log("已经登录");
            }
            if(info.error === 400)
            {
                location.href="login.html";
            }

        }
    })
}


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

    //点击模态框按钮，模态框出现
    $(".icon-logout").on("click",function () {
        $('#Modal').modal('show')

    })

    //点击退出按钮，实现退出登录状态
    $("#btn-logout").on("click",function () {

        $.ajax({
            type:"get",
            url:"/employee/employeeLogout",
            dataType:"json",
            success:function (info) {

                console.log(info);

                if(info.success)
                {
                    location.href="login.html";
                }

            }
        })

    })

});
