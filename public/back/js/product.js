$(function () {

    var currentpage=1;//当前页
    var pagesieze=2;//每页的数据
    var picarr=[];//存放图片对象的数组

    render();
    // 功能1：页面基本渲染
    function render() {

        $.ajax({
            type:"get",
            url:'/product/queryProductDetailList',
            data:{
                page:currentpage,
                pageSize:pagesieze
            },
            dataType:"json",
            success:function (info) {

                console.log(info);
                var htmlstr=template("tpl",info);
                $('.content tbody').html(htmlstr);

                //分页插件初始化
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    //当前页
                    currentPage:info.page,
                    //总页数
                    totalPages:info.total/info.size,
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(a, b,c,page){
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        currentpage=page;
                    },
                    itemTexts:function (type,page,current) {
                        // 配置按钮文本
                        // 每个按钮在初始化的时候, 都会调用一次这个函数, 通过返回值进行设置文本
                        // 参数1: type  取值: page  first  last  prev  next
                        // 参数2: page  指当前这个按钮所指向的页码
                        // 参数3: current 当前页
                        switch ( type ) {
                            case "page":
                                return page;
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                        }

                    }, // 配置 title 提示信息
                    // 每个按钮在初始化的时候, 都会调用一次这个函数, 通过返回值设置title文本
                    tooltipTitles: function( type, page, current ) {
                        switch ( type ) {
                            case "page":
                                return "前往第" + page + "页";
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                        }
                    },
                    // 使用 bootstrap 的提示框组件
                    useBootstrapTooltip: true,

                    // 给 页码 添加点击事件
                    onPageClicked: function( a, b, c, page ) {
                        // 更新当前页
                        currentpage = page;
                        // 重新渲染
                        render();
                    }
                });

            }
        })

    }

    //功能2：模态框弹出
    $('#addBtn').on("click",function () {

        $('#Modal').modal("show");
        $.ajax({
            type:'get',
            url:'/category/querySecondCategoryPaging',
            data:{
                page:1,
                pageSize: 100
            },
            success:function (info) {

                //console.log(info);
                var htmlstr=template('tplpd',info);
                $('.dropdown-menu').html(htmlstr);


            }
        })

    })

    //功能3：点击选中下拉框中的数据
    $('.dropdown-menu').on('click','a',function () {

        var txt=$(this).text();
        $('#dropdownText').text(txt);

        var id=$(this).data("id");
        console.log(id);

        $('[name ="brandId"]').val(id);

        $("#form").data('bootstrapValidator').updateStatus("brandId","status");


    })

    //功能4：文件上传初始化
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
            //data.result 图片对象
            //console.log(data.result);
            //将图片对象依次向前添加到数组中
            picarr.unshift(data.result);
            //将图片追到页面中
            $('#imgBox').prepend('<img src="'+ data.result.picAddr +'" width="100" alt="">');
            //判断用户上传的图片
            if(picarr.length > 3)
            {
                //删除数组中最后一个图片对象
                picarr.pop();
               $('#imgBox img:last-of-type').remove();

            }

            //如果用户上除了三张图片就重置状态
            if(picarr.length===3)
            {
                $("#form").data('bootstrapValidator').updateStatus("picStatus","status");
            }




        }
    });

    //功能5：校验表单
    $('#form').bootstrapValidator({
        excluded: [],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            proName:{
                validators:{
                    notEmpty:{
                        message:'产品名称不能为空'
                    }
                }
            },
            oldPrice:{
                validators: {
                    notEmpty: {
                        message: '原价不能为空'
                    }
                }
            },
            price: {
                validators:{
                    notEmpty:{
                        message:'价格不能为空'
                    }
                }
            },
            proDesc: {
                validators:{
                    notEmpty:{
                        message:'产品描述不能为空'
                    }
                }
            },
            size:{
                validators:{
                    notEmpty:{
                        message:'尺寸不能为空'
                    },
                    regexp: {
                        regexp:/^[1-9]\d{1}-\d{2}$/,
                        message: '商品尺码格式的类型必须是32-64'
                    }
                }

            },
            num:{
                validators:{
                    notEmpty:{
                        message:'数量不能为空'
                    },
                    regexp: {
                        regexp:/^[1-9]\d*$/,
                        message: '商品库存必须是非零开头的数字'
                    }
                }
            },
            brandId:{
                validators:{
                    notEmpty:{
                        message:'二级分类不能为空',
                    }
                }
            },
            picStatus:{
                validators:{
                    notEmpty:{
                        message:'请选择3张图片'
                    }
                }
            }

        }

    })

    //功能6：提交表单


    $('#form').on("success.form.bv", function( e ) {
        // 阻止默认的提交
        e.preventDefault();

        // 获取的是表单元素的数据
        var  formstr = $('#form').serialize();

        //console.log(formstr);

        // 还需要拼接上图片的数据
        // &picName1=xx&picAddr1=xx
        // &picName2=xx&picAddr2=xx
        // &picName3=xx&picAddr3=xx
        console.log(picarr);

        formstr+="&picName1="+picarr[0].apicName+"&picAddr1"+picarr[0].picAddr;
        formstr+="&picName1="+picarr[1].apicName+"&picAddr1"+picarr[1].picAddr;
        formstr+="&picName1="+picarr[2].apicName+"&picAddr1"+picarr[2].picAddr;

        console.log(formstr);

        $.ajax({
            type:'post',
            url:'/product/addProduct',
            data:formstr,
            dataType:'json',
            success:function (info) {

                console.log(info);
                if(info.success)
                {
                    $('#Modal').modal('hide');
                    render();
                    $("#form").data('bootstrapValidator').resetForm(true);
                    $('#dropdownText').text("请选择二级分类");
                    $('#imgBox img').remove(); // 让所有的图片自杀
                }

            }
        })





    });






})