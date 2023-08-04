const express = require('express');
const router = express.Router();

const db_handler = require('./db_handler.js');

//GM后台
router.post('/GM', db_handler.gm);

//登录
router.post('/logon', db_handler.userLogon);

//账号密码登录
//1.注册passwordRegister
router.post('/register', db_handler.passwordRegister);

//2.登录
router.post('/logon_password', db_handler.passwordLogon);

//用户上传排行数据
router.post('/uploadRank', db_handler.userUploadRank);

//用户请求查看排行榜
router.post('/inquiry', db_handler.sendingRank);

//用户请求查看排行榜
router.post('/inquirySp', db_handler.sendingRankSp);

//向用户返回礼包码兑换情况
router.post('/cdk', db_handler.cdk);

//记录cdk领取日志
router.post('/cdkLog', db_handler.cdkLog);

//用户登记雇佣角色
router.post('/longonHire', db_handler.receiveActor);

//向用户发送可雇佣角色列表
router.get('/getHire', db_handler.sendingHireActorList);

//向用户选定雇佣角色数据
router.post('/hireActor', db_handler.sendingHireActor);

//查询
router.post('/queryCloud', db_handler.queryCloud);

//用户上传存档
router.post('/cloudStorage', db_handler.receiveStorage);

//读档
router.post('/load', db_handler.load);

//公告
router.post('/getNotice', db_handler.notice);

//版本号
router.get('/version', db_handler.version);

router.get('/111', db_handler.ceshi)

module.exports = router;