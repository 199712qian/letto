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
            url:"/category/querySecondCategoryPaging",
            data:{
                page:currentpage,
                pageSize:pagesize
            },
            dataType:"json",
            success:function (info) {

                //console.log(info);

                var htmlstr=template("tpl",info);

                $(".content tbody").html(htmlstr);

                //console.log(info);
                // 分页插件初始化
                $("#paginator").bootstrapPaginator({
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
    $("#addBtn").on("click",function () {

        $("#Modal").modal("show");

        //点击按钮时发送请求获取一级分类中的数据
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize: 100
            },
            success:function (info) {

                console.log(info);

              var htmlstr =template('downtpl',info);

              $(".dropdown-menu").html(htmlstr);

            }
        })

    })

    //功能3：点击下框时，选中下拉框中的数据，使用事件委托
    $("#dropdown_list").on("click","a",function () {

        //获取选中的a中的数据
        var txt=$(this).text();
        //console.log(txt);
        $("#dropdown-btn").text(txt);
        //获取当前分类的id
        var id=$(this).data("id");
        console.log(id);
        $('[name="categoryId"]').val(id);
        //获取表单实例，更新校验状态
        $("#form").data('bootstrapValidator').updateStatus('categoryId','VALID');

    })

    //功能4：图片上传
    $("#fileupload").fileupload({

        dataType: "json",
        done:function (e,data) {

            //获取图片路径
            var picurl=data.result.picAddr;
            //console.log(picurl);
            //更改图片路径
            $("#img-box img").attr("src",picurl);
            $('[name="brandLogo"]').val(picurl);
            $("#form").data('bootstrapValidator').updateStatus('brandLogo','VALID');

        }
    })

    //功能5：表单校验
    $("#form").bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            categoryId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '一级分类不能为空'
                    },
                }
            },
            brandName:{
                validators: {
                    notEmpty: {
                        message: '一级分类不能为空'
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:'不能为空'
                   }
                }
            }

        }

    });

    //功能6：发送请求添加数据
    $("#form").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            type:"post",
            url:"/category/addSecondCategory",
            data:$('#form').serialize(),
            success:function (info) {

                console.log(info);
                if(info.success)
                {
                    $('#Modal').modal('hide');
                    render();
                    //渲染成功后重置表单内容
                    $('#form').data('bootstrapValidator').resetForm(true);
                    $('#dropdown-btn').text('请选择一级分类');
                    $('#img-box img').attr("src","images/default.png");
                }

            }
        })
    });
})