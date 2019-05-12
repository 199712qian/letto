$(function () {

    var currentpage=1;
    var pageSize=5;
    var userid;//当前用户的id
    var  deleteid;//当前用户的状态

    //功能1：分页按钮渲染
    // 1. 一进入页面, 发送 ajax 请求所有用户的数据, 进行页面渲染
    render();
    // 作用: 根据全局的currentPage和pageSize进行页面渲染
    function render() {
        $.ajax({
            type: "get",
            url: "/user/queryUser",
            data: {
                page: currentpage,
                pageSize:pageSize
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                // 参数1: 模板id
                // 参数2: 数据对象
                var htmlStr = template("tpl", info);
                $('.lt_content tbody').html(htmlStr);

                $("#pagintor").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:info.page,//当前页
                    totalPages:Math.ceil(info.total/info.size),//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(a, b, c,page){
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        //更新当前页
                        currentpage=page;
                        render();
                    }
                });

            }
        });

    }

    //功能2：点击禁用，正常按钮弹出模态框，使用事件委托进行注册
    //点击按钮时，获取用户id,isDelete的参数
    $("tbody").on("click",".btn",function () {

        $("#userModal").modal('show');
       userid=$(this).parent().data("id");
       //console.log(userid);
       //1 表示启用 0 表示禁用
        //通过类名来判断当前对象的状态
        deleteid=$(this).hasClass("btn-danger")? 0:1;
        //console.log(deleteid);

    })
    //功能3 点击模态框的确认按钮改变用户的状态
    $("#btnsumbit").on("click",function () {

     // console.log(userid);
      //console.log(deleteid);
        $.ajax({
            type:"post",
            url:"/user/updateUser",
            data:{
                id:userid,
                isDelete:deleteid
            },
            dataType: "json",
            success:function (info) {

                console.log(info);
                //关闭模态框
                $("#userModal").modal('hide');
                //重新渲染页面
                render();

            }
        })

    })

});