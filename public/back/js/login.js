$(function () {

    /*
  * 1. 进行表单校验配置
  *    校验要求:
  *        (1) 用户名不能为空, 长度为2-6位
  *        (2) 密码不能为空, 长度为6-12位
  * */

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
                       min: 6,
                       max: 12,
                       message: "用户名的长度在2-6位之间"
                   },
                   // 专门用于配置回调提示的规则
                   callback: {
                       message: "用户名不存在"
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
                   }
               }
           }
       }

   })

})