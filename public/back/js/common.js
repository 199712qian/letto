
//进度条效果
$(document).ajaxStart(function () {

    //第一个ajax请求发送时，进度条开始
    NProgress.start();

});
$(document).ajaxStop(function () {

    NProgress.done();
    
})
