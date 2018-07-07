layui.use(['form','layer','jquery'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer
        $ = layui.jquery;

    //登录按钮
    // form.on("submit(login)",function(data){
    //    alert(6666)
    //     return false;
    // })
    form.on('submit(login)', function(data){
        layer.alert(JSON.stringify(data.field), {
          title: '最终的提交信息'
        })
        return false;
      });


})
