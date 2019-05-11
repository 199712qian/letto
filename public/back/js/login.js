$(function () {

    /*
  * 1. 进行表单校验配置
  *    校验要求:
  *        (1) 用户名不能为空, 长度为2-6位
  *        (2) 密码不能为空, 长度为6-12位
  * */
   //表单校验功能
   $("#form").bootstrapValidator({

       //表单校验
       fields:{
           username: {
               validators: {
                   notEmpty: {
                       message: "用户名不能为空"
                   },
                   //校验长度
                   stringLength: {
                       min: 2,
                       max: 12,
                       message: "用户名的长度在2-6位之间"
                   },
                   // 专门用于配置回调提示的规则
                   callback:{
                       message:"该用户不存在"
                   }
               }
           },
           password: {
               validators: {
                   notEmpty: {
                       message: "密码不能为空"
                   },
                   stringLength: {
                       min: 6,
                       max: 12,
                       message: "密码的长度在6-12位之间"
                   },
                   callback: {
                       message:"密码不正确"
                   }
               }
           }
       }

   })

    /*
  * 2. 登陆功能
  *    表单校验插件会在提交表单时进行校验
  *    (1) 校验成功, 默认就提交表单, 会发生页面跳转,
  *        我们需要注册表单校验成功事件, 阻止默认的提交, 通过ajax进行发送请求
  *    (2) 校验失败, 不会提交表单, 配置插件提示用户即可
  * */
    //登录功能
    $("#form").on("success.form.bv",function (e) {

        e.preventDefault();
        console.log("成功后默认表单事件被阻止");

        $.ajax({
            type:"post",
            url:" /employee/employeeLogin",
            data:$("#form").serialize(),
            success:function (info) {
                console.log(info);

                //如果用户登录成功跳转到首页
                if(info.success)
                {
                    location.href="index.html";
                }
                //如果用户不存在
                if(info.error === 1000)
                {
                    //alert("用户不存在");
                    $("#form").data('bootstrapValidator').updateStatus("username","INVALIDATOR","callback");
                }
                //如果用户密码错误
                if(info.error === 1001)
                {
                    //alert ("密码错误");
                    $("#form").data("bootstrapValidator").updateStatus("password","INVALIDATOR",callback);
                }

            }
        })


    })


    //重置功能
    //给重置按钮注册点检事件
    $('[type="reset"]').on("click",function () {

       $("#form").data('bootstrapValidator').resetForm();


    })
})