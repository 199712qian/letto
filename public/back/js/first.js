$(function () {

    //当前页
    var currentpage=1;
    //每页的数据
    var pagesize=5;

    //功能1一进入页面进行页面渲染
    render();
    function render() {

        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:currentpage,
                pageSize:pagesize
            },
            dataType:"json",
            success:function (info) {

                //console.log(info);

                var htmlstr=template("tpl",info);

                $(".content tbody").html(htmlstr);

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

        })

    }

    //功能2：点击添加按钮弹出模态框
    $("#btnadd").on('click',function () {

        $("#addModal").modal("show");

    })

    //功能3：表单校验
    $('#form').bootstrapValidator({

        // 配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',    // 校验成功
            invalid: 'glyphicon glyphicon-remove',  // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },

        // 字段列表
        fields: {
            categoryName: {
                // 校验规则, 要求非空
                validators: {
                    notEmpty: {
                        message: "请输入一级分类名称"
                    }
                }
            }
        }
    });


    //功能4：提交表单添加数据
    $("#form").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            type:"post",
            url:"/category/addTopCategory",
            data:$("#form").serialize(),
            success:function (info) {
                console.log(info);
              if(info.success)
              {
                  //关闭模态框
                  $("#addModal").modal("hide");
                  //重新渲染页面
                  render();
              }

              //添加成功后重置模态框中的数据
                $("#form").data('bootstrapValidator').resetForm(true);

            }
        })
    });
})