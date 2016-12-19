var express     =       require('express');
var router      =       express.Router();
//var Movie   =   require('../model/movies.js');//引入模型文件导出的模块
//var About       =       require('../model/abouts.js');//引入模型文件导出的模块
var admin       =       require('../control/admin/admin.js');//引入模型文件导出的模块
var user        =       require('../control/admin/user.js');//引入模型文件导出的模块
var index       =       require('../control/index/index.js');//引入模型文件导出的模块

var multipart           =   require('connect-multiparty');
var multipartMiddleware =   multipart();


module.exports  =       router;




router.get('/user/index', user.index);
router.post('/user/login', user.login);
router.get('/user/logout', user.logout);
router.get('/user/newpassword', user.newpassword);
router.post('/user/new_user', user.new_user);

router.use(function(req, res, next){
  var _user = req.session.user;
  if(_user == undefined){
    res.redirect('/user/index');
  }else{
    res.locals.user = _user;
  }
  //res.locals.user可以讲user的所有值传到前台（渲染）
  next();
})



router.get('/admin', admin.index);
router.get('/admin/general/:id', admin.general);
router.post('/admin/general_change', multipartMiddleware,admin.general_change) ;

router.get('/admin/jiugong/:id', admin.member);
router.get('/admin/member_add', admin.member_add);
router.post('/admin/member_add_save', admin.member_add_save);
router.get('/admin/member_edit/:id', admin.member_edit);
router.post('/admin/member_edit_save', admin.member_edit_save);
router.delete('/admin/news_delete/:id', admin.news_delete);


router.get('/admin/information/:id', admin.information);
router.get('/admin/information_add', admin.information_add);
router.post('/admin/information_add_save', admin.information_add_save);
router.get('/admin/information_edit/:id', admin.information_edit);
router.post('/admin/information_edit_save', admin.information_edit_save);

router.get('/admin/exchange/:id', admin.exchange);
router.get('/admin/exchange_add', admin.exchange_add);
router.post('/admin/exchange_add_save', admin.exchange_add_save);
router.get('/admin/exchange_edit/:id', admin.exchange_edit);
router.post('/admin/exchange_edit_save', admin.exchange_edit_save);

router.get('/admin/achievement/:id', admin.achievement);
router.get('/admin/achievement_add', admin.achievement_add);
router.post('/admin/achievement_add_save', admin.achievement_add_save);
router.get('/admin/achievement_edit/:id', admin.achievement_edit);
router.post('/admin/achievement_edit_save', admin.achievement_edit_save);

router.get('/admin/message/:id', admin.message);
router.get('/admin/message_add', admin.message_add);
router.post('/admin/message_add_save', admin.message_add_save);
router.get('/admin/message_edit/:id', admin.message_edit);
router.post('/admin/message_edit_save', admin.message_edit_save);