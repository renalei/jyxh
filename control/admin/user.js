
var User         =   require('../../model/users.js');//引入模型文件导出的模块
var bodyParser  =   require('body-parser');
var bcrypt      =   require('bcrypt-nodejs');

var _               =   require('underscore');//新数据替换旧数据
var util            =   require('util');
var fs              =   require('fs');
exports.index=function(req, res, next) {
    res.render('admin/user/index',{
          title : '教育协会管理者登录'
    });
}


exports.login=function(req, res, next) {
    var userData = req.body;
    var user
    User.find(function (err, users) {
        if (err) console.log(err);
        user = users[0];
        if(user){
            bcrypt.compare(userData.admin_password, user.admin_password, function(err, istrue){//密码的加密
                if (err) return next(err);
                if(istrue){
                  console.log('你输入的密码正确！');
                  req.session.user = user;
                  res.redirect('/admin/general/1');
                }else{
                  console.log('你输入的密码不正确！');
                  res.redirect('/user/index');
                }
             })
       }else{
              res.redirect('/user/index');
       }
    });
}

exports.logout=function(req, res){
  delete req.session.user;
  delete res.locals.user;
  res.redirect('/user/index');
}
exports.newpassword=function(req, res, next) {
    User.find(function(err,userdata){
        res.render('admin/user/newpassword',{
            title : '修改密码',
            admin_name : userdata[0].admin_name
         });
    });
}

exports.new_user=function(req, res, next) {
    var new_user = req.body;
    var _user
    User.find(function(err,userdata){
      bcrypt.hash(new_user.admin_password, null, null, function(err, hash){//密码的加密
         if (err) return next(err);
         new_user.admin_password = hash;
         _user  =   _.extend(userdata[0], new_user);//新数据替换旧数据
         _user.save(function(err, data1){
                if(err)console.log(err);
                //res.redirect('/admin/7');
                res.redirect('/user/logout');
             })
       });
    })
}

