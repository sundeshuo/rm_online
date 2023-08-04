/*:
 * @target MZ
 * @author sun
 * @plugindesc 简易网络系统
 * 
 * @help
 * 先声明下：
 * 本人并不是专业的程序员，突然有了某种想法，奈何去网上找了一圈找不到合适的插件
 * 然后决定自力更生，去网上学习了一些知识，制作了这个插件；
 * 在写代码方面我真的是一个新手，所以可能很多地方写的都很渣，如果那里写的很蠢，
 * 请大佬们不要嘲笑，如果能指点一下就更好了~~
 * 然后插件使用以及配套的后端程序没有任何限制，可以任意使用修改等等，也不需要注明出处。
 * 
 * 目前雇佣系统还没有写完登记的指令只是现在测试用，后面会做到招募场景的ui里
 * ==================================================
 * 实现一些基础的网络功能：
 * 1.排行榜：
 *     向服务器上传指定变量的值作为成绩，普通排行榜每个id只能上传一次再次上传会覆盖之前的。
 * SP排行榜同id也可以反复上传，实现霸榜。
 *     两种排行榜都是按成绩由大到小排列，如果成绩相同则按照上传时间，时间早的排在前面。
 *     现在可以再服务端的config文件中配置排行榜显示的数量了，每页显示10个。
 * 2.礼包码:
 *     礼包cdk以及奖励内容皆存在服务器上的mysql数据库里，可通过数据库连接工具连接数据库后
 * 修改，即可实现不更新游戏的情况增加礼包码。
 * 3.雇佣系统:
 *     可以将自己的角色登录，其他玩家可以通过人才市场雇佣为你作战。如果队伍中已存在要雇佣的
 * 角色，则无法完成，需要先将该角色离队才可雇佣，后续使用解雇功能，还可将你本来的角色招回来。
 * 目前价格没用任何作用，等待后续更新。
 * 4.账号密码登录:
 *     可以使用账号密码进行注册以及登录，并且会在屏幕右下角显示登录状态，登录后会显示一个唯一
 * 且不会变的uid。
 * 5.云存档:
 *     登录后可以以当前状态存档上传到服务器，在其他设备游玩时可以使用相同账号登录游戏将存档
 * 下载回来，以实现多端无缝游玩。
 * 6.pc端自动更新:
 *     只在nw平台才会生效，需要拓展插件sun_online_updater.js，该插件也可单独使用，具体使用
 * 方法见该插件插件说明。
 * 7.聊天功能:
 *     需要拓展插件sun_online_expand.js，不能单独使用具体使用方法见该插件插件说明。   
 * --后续计划增加内容：
 * 8.道具交易所（没有放作弊手段，以后再说）
 * ==================================================
 * 
 * MZ的插件指令现在可以使用了！！
 * 
 * （旧）插件指令
 * 注册唯一用户名：
 * online.logon();
 * 登记排行榜（将id为xx的变量的值作为成绩上传到服务器）：
 * online.recordRanking(valueId);
 * 获取排行榜数据：
 * online.getRanking();
 * 礼包码：
 * online.cdk();
 * 登记雇佣角色：
 * online.hireEnroll();
 * 打开雇佣市场：
 * SceneManager.push(Scene_Hire);
 * 解除雇佣：
 * online.removeHire();
 * 单行弹出提示窗口：
 * online.tipWindowPopup(text);
 * ==================================================
 * Version - 0.3.1 - 20230715
 * 1.全新的登录界面；
 * 2.全新的云存档界面;
 * 3.服务端配置文件增加排行榜设置，现在排行榜可以显示任意数量了！(自行去服务端config文件设置，默认为20);
 * 4.增加公告显示，可以再屏幕上方显示一个可滚动的公告栏;
 * Version - 0.3 - 20230711
 * 1.增加账号密码登录；
 * 2.游戏界面右下角显示登录状态;
 * 3.云存档;
 * Version - 0.2.3 - 20230616
 * 1.修复了手机端由于浏览器缓存问题引起的部分数据无法刷新的情况;
 * Version - 0.2.2 - 20230615
 * 1.修复亿些bug；
 * 2.雇佣角色无法更换装备;
 * 3.提示语自定义;
 * 4.增加一个排行榜Plus版本;
 * 5.增加了mz的插件指令
 * Version - 0.2.1 - 20230614
 * 1.修复亿些bug；
 * 2.完善一点角色雇佣功能；
 * Version - 0.2 - 20230613
 * 1.增加角色雇佣功能（初版）；
 * Version - 0.1 - 20230610
 * 1.排行榜+在线礼包码完成；
 * ==================================================
 * 
 * @command logon
 * @text 简易登录
 * @desc 注册登录用（无需密码）
 * 
 * @command password logon
 * @text 账密登录
 * @desc 使用账号密码进行注册或者登录
 * 
 * @command rank
 * @text 排行榜
 * @desc 上传排行榜数据
 * 
 * @arg valueId
 * @type number
 * @text 变量id
 * @desc 数据存在那个变量中
 * @default 1
 * 
 * @command openRank
 * @text 打开排行榜
 * @desc 查看排行榜
 * 
 * @command openRankSp
 * @text 打开SP排行榜
 * @desc 查看SP排行榜
 * 
 * @command cdk
 * @text 兑换码
 * @desc 使用兑换码
 * 
 * @command reg
 * @text 登记雇佣
 * @desc 登记雇佣角色
 * 
 * @command openHire
 * @text 人才市场
 * @desc 打开雇佣商店
 * 
 * @command removeHire
 * @text 解雇
 * @desc 解除雇佣状态
 * 
 * @command cloud storage
 * @text 云存档
 * @desc 云存档调出云存档界面
 * 
 * @command call notice
 * @text 显示公告栏
 * @desc 再屏幕上方呼出一个滚动公告栏，公告的内容在服务器config配置文件中设置
 * 
 * @command remove notice
 * @text 移除公告栏
 * @desc 移除屏幕上方的公告栏
 * 
 * @param IP
 * @text 服务器地址
 * @type string
 * @default xxx.xxx.xxx.xxx
 * @desc 你的服务端的IP地址，如果使用默认，将使用作者提供的测试服务器
 * 
 * @param PORT
 * @text 端口
 * @type number
 * @min 1
 * @max 65535
 * @default 9000
 * @desc 你的服务端监听端口，需要与服务端配置文件中设置的一样
 * 
 * @param Achievement
 * @text 排行榜成绩名称
 * @type string
 * @default 战斗力
 * @desc 你的排行榜根据什么排名，显示在排行榜上的名称
 * 
 * @param Rank Windows Width
 * @text 排行榜窗口宽度
 * @type number
 * @min 0
 * @default 400
 * @desc 排行榜窗口的宽度
 * 
 * @param Hire Value Id
 * @text 雇佣变量id
 * @type number
 * @min 1
 * @default 10
 * @desc 占用一个变量，用来存储登记雇佣价格的变量id，注意不要使用次变量做别的用处
 * 
 * @param
 * @text ============提示用语=============
 * @default 
 * @desc 
 * 
 * @param Text1
 * @text 无法更换雇佣角色装备
 * @type string
 * @default 无法更换雇佣角色装备
 * @desc 自定义提示用语
 * 
 * @param Text2
 * @text 连接超时
 * @type string
 * @default 连接超时
 * @desc 自定义提示用语(无法连接服务器或404)
 * 
 * @param Text3
 * @text 未注册
 * @type string
 * @default 未注册
 * @desc 自定义提示用语
 * 
 * @param Text4
 * @text 已登录
 * @type string
 * @default 已登录
 * @desc 自定义提示用语
 * 
 * @param Text5
 * @text 注册成功
 * @type string
 * @default 注册成功
 * @desc 自定义提示用语
 * 
 * @param Text6
 * @text 该名称已被占用
 * @type string
 * @default 该名称已被占用
 * @desc 自定义提示用语
 * 
 * @param Text7
 * @text 名字不能为空
 * @type string
 * @default 名字不能为空
 * @desc 自定义提示用语
 * 
 * @param Text8
 * @text 注册失败，请稍后再试
 * @type string
 * @default 注册失败，请稍后再试
 * @desc 自定义提示用语
 * 
 * @param Text9
 * @text 未注册
 * @type string
 * @default 未注册
 * @desc 自定义提示用语
 * 
 * @param Text10
 * @text 上传成功
 * @type string
 * @default 上传成功
 * @desc 自定义提示用语
 * 
 * @param Text11
 * @text 上传失败，请稍后再试
 * @type string
 * @default 上传失败，请稍后再试
 * @desc 自定义提示用语
 * 
 * @param Text12
 * @text 无效的礼包码
 * @type string
 * @default 无效的礼包码
 * @desc 自定义提示用语
 * 
 * @param Text13
 * @text 已使用过相同类型的礼包码
 * @type string
 * @default 已使用过相同类型的礼包码
 * @desc 自定义提示用语
 * 
 * @param Text14
 * @text 登记成功
 * @type string
 * @default 登记成功
 * @desc 自定义提示用语
 * 
 * @param Text15
 * @text 雇佣成功
 * @type string
 * @default 雇佣成功
 * @desc 自定义提示用语
 * 
 * @param Text16
 * @text 已解雇
 * @type string
 * @default 已解雇
 * @desc 自定义提示用语
 * 
 * @param Text17
 * @text 当前未雇佣任何角色
 * @type string
 * @default 当前未雇佣任何角色
 * @desc 自定义提示用语
 * 
 * @param Text18
 * @text 未选择雇佣对象
 * @type string
 * @default 未选择雇佣对象
 * @desc 自定义提示用语
 * 
 * @param Text19
 * @text 请先解除之前雇佣角色
 * @type string
 * @default 请先解除之前雇佣角色
 * @desc 自定义提示用语
 * 
 * @param Text20
 * @text 队伍中已存在该角色
 * @type string
 * @default 队伍中已存在该角色
 * @desc 自定义提示用语
 * 
 * @param Text21
 * @text 刷新间隔小于5秒
 * @type string
 * @default 刷新间隔小于5秒
 * @desc 自定义提示用语
 */

//待解决的问题：
//  1礼包内容物品id如果rm数据库不存在会报错 
//  2没设礼包内容弹未知错误 
//  3服务器响应头应该加上不允许浏览器缓存 
//  4数据库user表单name改user

var Imported = Imported || {};
Imported.sun_online = true;

var sun_online_param = sun_online_param || {};
sun_online_param.parameters = PluginManager.parameters('sun_online');
sun_online_param.ip = String(sun_online_param.parameters['IP'] || 0);
sun_online_param.port = String(sun_online_param.parameters['PORT'] || 0);
sun_online_param.achievement = String(sun_online_param.parameters['Achievement'] || 0);
sun_online_param.rankWindowsWidth = Number(sun_online_param.parameters['Rank Windows Width'] || 0);
sun_online_param.hireValueId = Number(sun_online_param.parameters['Hire Value Id'] || 1);

sun_online_param.text1 = String(sun_online_param.parameters['Text1'] || 0);
sun_online_param.text2 = String(sun_online_param.parameters['Text2'] || 0);
sun_online_param.text3 = String(sun_online_param.parameters['Text3'] || 0);
sun_online_param.text4 = String(sun_online_param.parameters['Text4'] || 0);
sun_online_param.text5 = String(sun_online_param.parameters['Text5'] || 0);
sun_online_param.text6 = String(sun_online_param.parameters['Text6'] || 0);
sun_online_param.text7 = String(sun_online_param.parameters['Text7'] || 0);
sun_online_param.text8 = String(sun_online_param.parameters['Text8'] || 0);
sun_online_param.text9 = String(sun_online_param.parameters['Text9'] || 0);
sun_online_param.text10 = String(sun_online_param.parameters['Text10'] || 0);
sun_online_param.text11 = String(sun_online_param.parameters['Text11'] || 0);
sun_online_param.text12 = String(sun_online_param.parameters['Text12'] || 0);
sun_online_param.text13 = String(sun_online_param.parameters['Text13'] || 0);
sun_online_param.text14 = String(sun_online_param.parameters['Text14'] || 0);
sun_online_param.text15 = String(sun_online_param.parameters['Text15'] || 0);
sun_online_param.text16 = String(sun_online_param.parameters['Text16'] || 0);
sun_online_param.text17 = String(sun_online_param.parameters['Text17'] || 0);
sun_online_param.text18 = String(sun_online_param.parameters['Text18'] || 0);
sun_online_param.text19 = String(sun_online_param.parameters['Text19'] || 0);
sun_online_param.text20 = String(sun_online_param.parameters['Text20'] || 0);
sun_online_param.text21 = String(sun_online_param.parameters['Text21'] || 0);



if (sun_online_param.ip === "xxx.xxx.xxx.xxx") {
    sun_online_param.url = "101.34.11.85" + ":" + sun_online_param.port;
}
else {
    sun_online_param.url = sun_online_param.ip + ":" + sun_online_param.port;
}

//online数据
$online = {};
$online.useCdk = {};
$online.uid = 1000000;
$online.isLogon = false;
$online.name = "游客" + Math.randomInt(10000);
$online.isBusy = false;

//================================================================================
//DOM
$onlineDom = null;
const head = document.getElementsByTagName("head")[0];
head.insertAdjacentHTML("beforeend", "<link rel=\"stylesheet\" href=\"css/sun.css\" />");

function stopPropagation(event) {
    event.stopPropagation();
}

class sun_dom {
    constructor() {
        this.isOpen = false;
        $online.isBusy = false;
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    };

    //登录窗
    createLongonHtml() {
        //存储对象方便操作
        this._logonChild = {};
        const child = this._logonChild;
        //最外层盒子
        this._logon = document.createElement('div');
        this._logon.className = "container";
        //内容盒子
        child._loginWrapper = document.createElement('div');
        child._loginWrapper.className = "login-wrapper";
        //表单盒子
        child._form = document.createElement('div');
        child._form.className = "form-wrapper";
        //标题
        child._title = this.createTitle("登录");
        //提示窗
        child._tip = this.createTip();
        child._tip.hidden = true;
        //用户名输入框
        child._inputUser = this.createInput("text", "用户名");
        //密码事如狂
        child._inputPassword = this.createInput("password", "密码");
        //登录按钮
        child._button = this.createButton("btn", "Login", this.logon.bind(this));
        //注册连接盒子
        child._register = this.createRegister(this.register.bind(this));
        //返回游戏按钮
        child._escButton = this.createButton("esc_btm", ">>>返回游戏<<<", this.esc.bind(this, "_logon"));
        //添加结构
        child._form.appendChild(child._inputUser);
        child._form.appendChild(child._inputPassword);
        child._form.appendChild(child._button);
        child._loginWrapper.appendChild(child._title);
        child._loginWrapper.appendChild(child._tip);
        child._loginWrapper.appendChild(child._form);
        child._loginWrapper.appendChild(child._register);
        child._loginWrapper.appendChild(child._escButton);
        this._logon.appendChild(child._loginWrapper);
    }

    createTitle(txt) {
        const div = document.createElement('div');
        div.className = "header";
        div.innerHTML = txt;
        return div;
    }

    createTip() {
        const div = document.createElement('div');
        div.className = "tip";
        return div;
    }

    createInput(type, txt) {
        const input = document.createElement('input');
        input.className = "input-item";
        input.type = type;
        input.placeholder = txt;
        input.autocomplete = "off";
        input.addEventListener("keydown", function (e) {
            if (e.keyCode === 8) {
                e.stopPropagation();
            }
        });
        input.addEventListener("touchstart", stopPropagation);
        return input;
    }

    createButton(_class, txt, fun) {
        const btn = document.createElement('div');
        btn.className = _class;
        btn.innerHTML = txt;
        btn.addEventListener("touchstart", stopPropagation);
        btn.onclick = function () {
            fun();
        }
        return btn;
    }

    createRegister(fun) {
        const child = this._logonChild;
        const msg = document.createElement('div');
        msg.className = "msg";
        msg.innerHTML = "没有账号?"
        child._link = document.createElement('a');
        child._link.innerHTML = "立即注册";
        child._link.onclick = function () {
            fun();
        }
        child._link.addEventListener("touchstart", stopPropagation);
        msg.appendChild(child._link);
        return msg;
    }

    openLogon() {
        if (this.isOpen === true) return;
        if (!this._logon) {
            this.createLongonHtml();
        }
        this._logonChild._inputUser.value = "";
        this._logonChild._inputPassword.value = "";
        this._logonChild._tip.hidden = true;
        document.body.appendChild(this._logon);
        this.isOpen = true;
    }

    logon() {
        if ($online.isBusy === true) {
            this.tip("请勿连续点击");
            return;
        }
        if (this.inputInspect() === false) {
            return;
        }
        const user = this._logonChild._inputUser.value;
        const password = md5(this._logonChild._inputPassword.value);
        const data = JSON.stringify({ 'user': user, 'password': password });
        online.passwordLogon(data);
    }

    register() {
        if ($online.isBusy === true) {
            this.tip("请勿连续点击");
            return;
        }
        if (this.inputInspect() === false) {
            return;
        }
        const user = this._logonChild._inputUser.value;
        const password = md5(this._logonChild._inputPassword.value);
        const data = JSON.stringify({ 'user': user, 'password': password });
        online.register(data)
    }

    inputInspect() {
        const user = this._logonChild._inputUser.value;
        const password = this._logonChild._inputPassword.value;
        if (user === "" || password === "") {
            this.tip("输入不合法");
            return false;
        }
    }

    esc(mode) {
        if (this.isOpen === false) return;
        this[mode].remove();
        this.isOpen = false;
        $online.isBusy = false;
    }

    //提示窗
    tip(txt) {
        this._logonChild._tip.innerHTML = txt;
        this._logonChild._tip.hidden = false;
    }

    //云存档界面
    createCloudStorageHtml() {
        this._cloudChild = {};
        const child = this._cloudChild;
        this._cloud = document.createElement('div');
        this._cloud.className = "container";
        child._Wrapper = document.createElement('div');
        child._Wrapper.className = "login-wrapper";
        child._title = this.createTitle("云存档");
        child._tip = this.createTip();
        child._tip.hidden = true;
        child._text = this.createText(this._cloudTime);
        child._uploadBtn = this.createButton("btn", "上传", online.saveGame);
        child._downloadBtn = this.createButton("btn", "下载", online.downloadCloud);
        child._escButton = this.createButton("esc_btm", ">>>返回游戏<<<", this.esc.bind(this, "_cloud"));
        //=============================================
        child._Wrapper.appendChild(child._title);
        child._Wrapper.appendChild(child._tip);
        child._Wrapper.appendChild(child._text);
        child._Wrapper.appendChild(child._uploadBtn);
        child._Wrapper.appendChild(child._downloadBtn);
        child._Wrapper.appendChild(child._escButton);
        this._cloud.appendChild(child._Wrapper);
    }

    createText(txt) {
        const p = document.createElement('p');
        p.className = "cloud_p";
        p.innerHTML = "服务器存档: " + txt;
        return p;
    }

    openCloud() {
        if (this.isOpen === true) return;
        if (!this._cloud) {
            this.createCloudStorageHtml();
        }
        document.body.appendChild(this._cloud);
        this._cloudChild._tip.hidden = true;
        this.isOpen = true;
    }

    cloudTip(txt) {
        this._cloudChild._tip.innerHTML = txt;
        this._cloudChild._tip.hidden = false;
    }

    //滚动公告
    createNotice() {
        this._notice = document.createElement('div');
        this._notice.className = "ad"
        if (Utils.isNwjs()) {
            this._notice.innerHTML = '<svg t="1689387652500" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1464" width="30" height="30"><path d="M747.642514 3.785143C742.500571 1.250743 736.965486 0 731.428571 0c-7.892114 0-15.714743 2.536229-22.213486 7.537371L215.464229 292.571429 36.571429 292.571429c-20.214857 0-36.571429 16.356571-36.571429 36.571429l0 365.714286c0 20.214857 16.356571 36.571429 36.571429 36.571429l178.8928 0 493.750857 285.035886C715.713829 1021.463771 723.536457 1024 731.428571 1024c5.535086 0 11.072-1.250743 16.213943-3.785143C760.107886 1014.036114 768 1001.3568 768 987.428571L768 36.571429C768 22.6432 760.107886 9.963886 747.642514 3.785143zM73.144686 365.714286l124.035657 0 0 292.571429L73.144686 658.285714 73.144686 365.714286zM694.857143 923.713829 252.035657 668.072229 235.072 658.285714l-1.322057 0L233.749943 365.714286l1.322057 0 16.963657-9.786514L694.857143 100.286171 694.857143 923.713829z" fill="#F69661" p-id="1465"></path><path d="M877.714286 219.428571c-20.214857 0-36.571429 16.356571-36.571429 36.571429l0 512c0 20.214857 16.356571 36.571429 36.571429 36.571429s36.571429-16.356571 36.571429-36.571429L914.285714 256C914.285714 235.785143 897.929143 219.428571 877.714286 219.428571z" fill="#F69661" p-id="1466"></path><path d="M987.428571 365.714286c-20.214857 0-36.571429 16.356571-36.571429 36.571429l0 219.428571c0 20.214857 16.356571 36.571429 36.571429 36.571429s36.571429-16.356571 36.571429-36.571429L1024 402.285714C1024 382.070857 1007.643429 365.714286 987.428571 365.714286z" fill="#F69661" p-id="1467"></path></svg><p class="content"><span id = "noticeSpan"></span></p>'
            return;
        }
        this._notice.innerHTML = '<i class="iconfont">&#xe6db;</i><p class="content"><span id = "noticeSpan"></span></p>';
    }

    addNotice() {
        if (!this._notice) {
            this.createNotice();
        }
        document.body.appendChild(this._notice);
        this._noticeSpan = document.getElementById("noticeSpan");
        this.showNotice();
    }

    removeNotice() {
        if (this._notice) {
            this._notice.remove();
        }
    }

    setNoticeText(text) {
        if (this._noticeSpan) {
            this._noticeSpan.innerHTML = text;
        }
    }

    hideNotice() {
        if (this._notice) {
            this._notice.style.visibility = "hidden";
        }
    }

    showNotice() {
        if (this._notice) {
            this._notice.style.visibility = "visible";
        }
    }
}
//================================================================================


//复写rm核心部分

/* 创建游戏对象 */
const sun_online_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function () {
    sun_online_createGameObjects.call(this);
    $onlineDom = new sun_dom();
};

//存档部分修改,将一些online变量保存进存档
const sun_online_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function () {
    const contents = sun_online_makeSaveContents.call(this);
    contents.online = $online;
    return contents;
};

const sun_online_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function (contents) {
    sun_online_extractSaveContents.call(this, contents)
    if (contents.online === undefined) return;
    $online = contents.online;
};

//当存在弹出窗口时，无法移动
const sun_online_isBusy = Game_Message.prototype.isBusy;
Game_Message.prototype.isBusy = function () {
    if (SceneManager._scene._longonWindow) return SceneManager._scene._longonWindow.visible;
    return online.isWindowsPopup() || sun_online_isBusy.call(this) || $online.isBusy;
};

//当存在雇佣角色时，雇佣角色不能切换装备
const sun_online_onSlotOk = Scene_Equip.prototype.onSlotOk;
Scene_Equip.prototype.onSlotOk = function () {
    const id = this.actor()._actorId;
    const txt = sun_online_param.text1;
    if ($online.hire === true && $online.hireId == id) {
        online.tipWindowPopup(txt);
        return;
    }
    sun_online_onSlotOk.call(this);
};

const sun_online_commandClear = Scene_Equip.prototype.commandClear;
Scene_Equip.prototype.commandClear = function () {
    const id = this.actor()._actorId;
    const txt = sun_online_param.text1;
    if ($online.hire === true && $online.hireId == id) {
        online.tipWindowPopup(txt);
        return;
    }
    sun_online_commandClear.call(this);
};

const sun_online_commandOptimize = Scene_Equip.prototype.commandOptimize;
Scene_Equip.prototype.commandOptimize = function () {
    const id = this.actor()._actorId;
    const txt = sun_online_param.text1;
    if ($online.hire === true && $online.hireId == id) {
        online.tipWindowPopup(txt);
        return;
    }
    sun_online_commandOptimize.call(this);
}

//改造数值输入窗口，以便登记雇佣时使用（弃用）
const sun_online_processOk = Window_NumberInput.prototype.processOk;
Window_NumberInput.prototype.processOk = function () {
    sun_online_processOk.call(this);
    if ($online.hireing == true) {
        const price = $gameVariables.value(sun_online_param.hireValueId);
        const id = $gameParty.leader()._actorId;
        online.regActor(id, price)
    }
};

//存档窗口修改
const sun_online_drawTitle = Window_SavefileList.prototype.drawTitle;
Window_SavefileList.prototype.drawTitle = function (savefileId, x, y) {
    if (savefileId === 1) {
        this.drawText(TextManager.file + " " + savefileId + "(云存档)", x, y, 180);
    }
    else {
        sun_online_drawTitle.call(this, savefileId, x, y)
    }
}

const sun_online_SavefileList_isEnabled = Window_SavefileList.prototype.isEnabled;
Window_SavefileList.prototype.isEnabled = function (savefileId) {
    if (this._mode === "save" && savefileId === 1) {
        return false;
    }
    return sun_online_SavefileList_isEnabled.call(this, savefileId);
}

//公告栏应该只在地图场景显示
const sun_online_goto = SceneManager.goto;
SceneManager.goto = function (sceneClass) {
    sun_online_goto.call(this, sceneClass)
    if ($onlineDom) {
        if (sceneClass != Scene_Map) {
            $onlineDom.hideNotice();
            return;
        }
        $onlineDom.showNotice();
    }
};
//================================================================================
class online {
    static xhr = new XMLHttpRequest();
    static rank = {};

    //创建连接，
    //此处利用ajax与服务器进行通信,ajax主流浏览器都支持,手机端也可以使用;
    //这里最早使用的是nodejs直接连接服务器数据库，之后尝试过将模块集成；
    //然而并不是专业程序员，查了很多资料也没有成功，无法在手机上使用；
    //之后了解了ajax
    static createLink(Method, url, request, result) {
        // Method: 请求方法
        // url: 请求地址
        // request: 请求体(携带的数据)
        // result: 回调函数,接收到服务器的响应后执行的函数
        const tempUrl = "http://" + sun_online_param.url + url;
        online.xhr.open(Method, tempUrl);
        //设置请求体,因为传输的请求数据基本都为json格式所以这里直接设置为application/json
        online.xhr.setRequestHeader("Content-type", "application/json");

        //监听函数
        online.xhr.onreadystatechange = function () {
            if (online.xhr.readyState === 4) {
                if (online.xhr.status >= 200 && online.xhr.status < 300) {
                    result(online.xhr.responseText);
                    return;
                }
                const txt = sun_online_param.text2
                online.tipWindowPopup(txt)
            }
        }

        online.xhr.send(request);
    }

    //判断是否登录
    static isLogon() {
        if ($online.isLogon != true) {
            const txt = sun_online_param.text3;
            online.tipWindowPopup(txt);
            return false;
        }
    }

    //简易登录
    static logon() {
        //如果未注册，玩家输入一个昵称并保存到变量中，之后向服务器发起注册请求。
        if ($online.isLogon == true) {
            const txt = sun_online_param.text4;
            online.tipWindowPopup(txt);
            return;
        }

        $online.name = prompt("请输入您的名字：", "李狗剩");
        //向服务器发起注册请求
        //设置参数
        const method = "post";
        const url = "/logon"
        const request = JSON.stringify({ 'user': $online.name });
        online.createLink(method, url, request, online.notifyLoginResults);
        //online.getLogonResult();
    }

    static notifyLoginResults(result) {
        let txt = "";
        switch (result) {
            case "99":
                online.tipWindowPopup("mysql错误,请检查服务器!");
                $online.name = undefined;
                break;
            case "100":
                txt = sun_online_param.text5;
                online.tipWindowPopup(txt);
                $online.isLogon = true;
                $online.uid = "已登录";
                if (SceneManager._scene._uidWindow) {
                    SceneManager._scene._uidWindow.refresh();
                }
                break;
            case "101":
                txt = sun_online_param.text7;
                online.tipWindowPopup(txt);
                $online.name = undefined;
                break;
            case "102":
                txt = sun_online_param.text6;
                online.tipWindowPopup(txt);
                $online.name = undefined;
                break;
            default:
                txt = sun_online_param.text8;
                online.tipWindowPopup(txt);
                $online.name = undefined;
                break;
        }
    }

    //账号密码登录
    static openLogon() {
        if (!$onlineDom) {
            $onlineDom = new sun_dom();
        }
        $onlineDom.openLogon();
    }

    //注册
    static register(data) {
        const method = "post";
        const url = "/register";
        const request = data;
        online.createLink(method, url, request, online.notifyRegisterResultSp);
    }

    static notifyRegisterResultSp(result) {
        switch (result) {
            case "99":
                online.tipWindowPopup("mysql错误,请检查服务器!");
                $online.name = undefined;
                break;
            case "100":
                $onlineDom.tip("恭喜！注册成功！")
                break;
            case "102":
                $onlineDom.tip("用户名已存在！")
                break;
            default:
                $onlineDom.tip("返回数据异常，请检查服务器错误日志！")
                break;
        }
        // $online.isBusy = false;
    }

    //登录
    static passwordLogon(data) {
        const method = "post";
        const url = "/logon_password";
        const request = data;
        online.createLink(method, url, request, this.notifyLogonResultSp);
    }

    static notifyLogonResultSp(result) {
        switch (result) {
            case "99":
                online.tipWindowPopup("mysql错误,请检查服务器!");
                $online.name = undefined;
                break;
            case "103":
                $onlineDom.tip("用户名不存在！");
                break;
            case "104":
                $onlineDom.tip("密码错误");
                break;
            default:
                try {
                    const data = JSON.parse(result);
                    if (data.uid) {
                        $onlineDom.tip("恭喜！登录成功，5s后将自动返回游戏...");
                        $online.isLogon = true;
                        $online.name = data.name;
                        $online.uid = data.uid;
                        if (SceneManager._scene._uidWindow) {
                            SceneManager._scene._uidWindow.refresh();
                        }
                        setTimeout('$onlineDom.tip("恭喜！登录成功，4s后将自动返回游戏...")', "1000");
                        setTimeout('$onlineDom.tip("恭喜！登录成功，3s后将自动返回游戏...")', "2000");
                        setTimeout('$onlineDom.tip("恭喜！登录成功，2s后将自动返回游戏...")', "3000");
                        setTimeout('$onlineDom.tip("恭喜！登录成功，1s后将自动返回游戏...")', "4000");
                        setTimeout("$onlineDom.esc('_logon')", "5000");
                    }
                } catch (error) {
                    $onlineDom.tip("服务器返回数据异常，请检查服务器错误日志！");
                }
                break;
        }
        // $online.isBusy = false;
    }

    //将id为xx的变量的值作为成绩上传到服务器
    static recordRanking(arg) {
        //判断是否登录
        if ($online.isLogon != true) {
            const txt = sun_online_param.text9;
            online.tipWindowPopup(txt);
            return;
        }
        const value = $gameVariables.value(arg.valueId);
        const name = $online.name;
        online.upload(name, value);
    }

    static upload(name, value) {
        //上传数据
        const method = "post";
        const url = "/uploadRank"
        const request = JSON.stringify({ 'name': name, 'value': value });
        online.createLink(method, url, request, online.notifyUploadResult);
    }

    static notifyUploadResult(result) {
        if (result == '1') {
            const txt = sun_online_param.text10;
            online.tipWindowPopup(txt);
            return;
        }
        else {
            const txt = sun_online_param.text11;
            online.tipWindowPopup(txt);
            return;
        }
    }

    //取得排行榜数据
    static getRanking() {
        //如果已登录则返回的排行会带有自己的成绩
        const method = "post";
        const url = "/inquiry"
        const request = JSON.stringify({ 'name': $online.name });
        online.createLink(method, url, request, online.notifyGetRankResult);
    }

    static notifyGetRankResult(result) {
        online.rank = JSON.parse(result);
        online.displayRanking();
    }

    //临时排行榜窗口
    static displayRanking() {
        online.rankWindowPopup()
    }

    //取得SP排行榜数据
    static getRankingSp() {
        //如果已登录则返回的排行会带有自己的成绩
        const method = "post";
        const url = "/inquirySp"
        const request = JSON.stringify({ 'name': $online.name });
        online.createLink(method, url, request, online.notifyGetRankResultSp);
    }

    static notifyGetRankResultSp(result) {
        online.rank = JSON.parse(result);
        online.displayRanking();
    }

    //礼包码
    static cdk() {
        const cdk = online.inputCdk();
        online.inspectCdk(cdk);
    }

    static inputCdk() {
        const tempCdk = prompt("请输入礼包码：", "AAABBBCCC");
        return tempCdk;
    }

    static inspectCdk(cdk) {
        const method = "post";
        const url = "/cdk";
        const request = JSON.stringify({ 'cdk': cdk });
        online.createLink(method, url, request, online.notifyCdkResults);
    }

    static notifyCdkResults(result) {
        if (result == '0') {
            //无效的礼包码
            const txt = sun_online_param.text12;
            online.tipWindowPopup(txt);
            return;
        }
        const data = JSON.parse(result)
        if (data.length === 0) {
            //未知错误
            const txt = sun_online_param.text2;
            online.tipWindowPopup(txt);
            return;
        }
        online.gainCdkItem(data);
    }

    static gainCdkItem(data) {
        const content = data;
        const name = $online.name;
        const uid = data[0].uid;
        if ($online.useCdk['uid'] == true) {
            //判断是否使用过相同类型的礼包码
            const txt = sun_online_param.text13;
            online.tipWindowPopup(txt);
            return;
        }
        for (let i = 0; i < content.length; i++) {
            switch (content[i].type) {
                case 'weapon': $gameParty.gainItem($dataWeapons[content[i].itemid], content[i].num);
                    break;
                case 'armor': $gameParty.gainItem($dataArmors[content[i].itemid], content[i].num);
                    break;
                case 'item': $gameParty.gainItem($dataItems[content[i].itemid], content[i].num);
                    break;
            }
        }
        $online.cdkProps = data;
        online.cdkWindowPopup();
        online.recordUseCdk(uid);
        if ($online.isLogon == true) {
            online.cdkLog(name, uid);
        }
    }

    static recordUseCdk(uid) {
        $online.useCdk['uid'] = true;
    }

    static cdkLog(name, uid) {
        const method = "post";
        const url = "/cdkLog";
        const request = JSON.stringify({ 'name': name, 'uid': uid });
        online.createLink(method, url, request, () => { console.log('日志已上传') });
    }

    //登记雇佣

    static hireEnroll() {
        const id = sun_online_param.hireValueId;
        $gameMap._interpreter.command103([id, 6]);
        $online.hireing = true;
    }


    //登录雇佣角色
    static regActor(id, price) {
        if (online.isLogon() == false) return;
        const method = "post";
        const url = "/longonHire";
        const name = $online.name;
        const actor = $gameActors.actor(id);
        const data = JsonEx.stringify(actor);
        const actorId = actor._actorId;
        const request = JSON.stringify({
            'user': name,
            'data': data,
            'price': price,
            'faceIndex': actor._faceIndex,
            'faceName': actor._faceName,
            'level': actor._level,
            'id': actorId
        });
        online.createLink(method, url, request, online.notifyRegActorResults);
    }

    static notifyRegActorResults(result) {
        if (result == '1') {
            //登记成功
            const txt = sun_online_param.text14;
            online.tipWindowPopup(txt);
            return;
        }
    }

    static hireActor(name) {
        const method = "post";
        const url = "/hireActor";
        const request = JSON.stringify({ 'user': name });
        $online.hireActorName = name;
        online.createLink(method, url, request, online.notifyHirResults);
    }

    static notifyHirResults(result) {
        const actor = JsonEx.parse(result.replace(/\n/g, '\\n').replace(/\\/g, '\\\\'));
        const id = actor._actorId;
        actor._name = $online.hireActorName;
        $gameActors.actor(id);
        //将自己本来的该角色深拷贝一份，以备解除雇佣状态
        $online.myActor = JsonEx.stringify($gameActors._data[id]);
        //用雇佣的角色数据替换原本的
        $gameActors._data[id] = actor;
        $gameParty.addActor(id);
        const txt = sun_online_param.text15;
        online.tipWindowPopup(txt);
        $online.hire = true;
        $online.hireId = id;
        //SceneManager._scene.popScene();
    }

    //解除雇佣状态，恢复本来角色
    static removeHire() {
        if ($online.hire === true) {
            const actor = JsonEx.parse($online.myActor);
            const id = actor._actorId;
            $gameParty.removeActor(id)
            $gameActors._data[id] = actor;
            $online.hire = false;
            $online.hireId = null;
            const txt = sun_online_param.text16;
            online.tipWindowPopup(txt);
            return;
        }
        if ($online.hire === false || $online.hire === undefined) {
            const txt = sun_online_param.text17;
            online.tipWindowPopup(txt);
        }
    }

    //调出窗口部分
    //提示窗口
    static tipWindowPopup(text) {
        if (!SceneManager._scene._onlineTipWindow) {
            SceneManager._scene._onlineTipWindow = new Window_onlineInfo;
            SceneManager._scene.addWindow(SceneManager._scene._onlineTipWindow);
        }
        SceneManager._scene._onlineTipWindow.show();
        SceneManager._scene._onlineTipWindow._text = text;
        SceneManager._scene._onlineTipWindow.refresh();
    }

    //窗口显示状态，防止点击窗口出现时点击还可以移动
    static isWindowsPopup() {
        const scene = SceneManager._scene;
        const a = scene._onlineTipWindow ? scene._onlineTipWindow.visible : false;
        const b = scene._onlineRankWindow ? scene._onlineRankWindow.visible : false;
        const c = scene._onlineRankWindow ? scene._onlineRankWindow.visible : false;
        return (a || b || c);
    }

    //排行榜
    static rankWindowPopup() {
        if (!SceneManager._scene._onlineRankWindow) {
            SceneManager._scene._onlineRankWindow = new Window_onlineRank;
            SceneManager._scene.addWindow(SceneManager._scene._onlineRankWindow);
        }
        SceneManager._scene._onlineRankWindow.show();
        SceneManager._scene._onlineRankWindow.refresh();
    }

    //兑换码获得物品清单
    static cdkWindowPopup() {
        if (!SceneManager._scene._onlineCdkWindow) {
            SceneManager._scene._onlineCdkWindow = new Window_onlineCdk;
            SceneManager._scene.addWindow(SceneManager._scene._onlineCdkWindow);
        }
        SceneManager._scene._onlineCdkWindow.show();
        SceneManager._scene._onlineCdkWindow.refresh();
    }

    static openHire() {
        SceneManager.push(Scene_Hire);
    }

    //==================云存档====================
    //云存档
    static cloudStorage() {
        //使用云存档必须处于登录状态
        if ($online.isLogon != true) {
            online.tipWindowPopup("未登录");
            return;
        }
        online.queryCloud(online.openCloud);
    }

    static queryCloud(fun) {
        const method = "post";
        const url = "/queryCloud"
        const request = JSON.stringify({ 'user': $online.name });
        online.createLink(method, url, request, fun);
    }

    static openCloud(result) {
        $onlineDom._cloudTime = result;
        $onlineDom.openCloud();
    }

    static setCloudTime(result) {
        $onlineDom._cloudTime = result;
        $onlineDom._cloudChild._text.innerHTML = "服务器存档: " + result;
    }

    static saveGame() {
        //制作存档数据
        $gameSystem.onBeforeSave();
        const contents = DataManager.makeSaveContents();
        const data = JsonEx.stringify(contents);
        online.sendingStorage(data);
    }

    static sendingStorage(data) {
        const method = "post";
        const url = "/cloudStorage"
        const request = JSON.stringify({ 'user': $online.name, 'data': data });
        online.createLink(method, url, request, online.notifyStorageResult);
    }

    static notifyStorageResult(result) {
        $onlineDom.cloudTip(result);
        online.queryCloud(online.setCloudTime);
    }

    //下载
    static downloadCloud() {
        const method = "post";
        const url = "/load"
        const request = JSON.stringify({ 'user': $online.name });
        online.createLink(method, url, request, online.notifyLoadResult);
    }

    static notifyLoadResult(result) {
        if (result === '无云存档') {
            $onlineDom.cloudTip(result);
            return;
        }
        const savefileId = 1;
        const data = result;
        const contents = JsonEx.parse(data.replace(/\n/g, '\\n').replace(/\\/g, '\\\\'));
        const saveName = DataManager.makeSavename(savefileId);
        return StorageManager.saveObject(saveName, contents).then(() => {
            DataManager._globalInfo[savefileId] = DataManager.makeSavefileInfo();
            DataManager.saveGlobalInfo();
            $onlineDom.cloudTip("同步成功，5s后将自动返回游戏...");
            setTimeout('$onlineDom.cloudTip("同步成功，4s后将自动返回游戏...")', "1000");
            setTimeout('$onlineDom.cloudTip("同步成功，3s后将自动返回游戏...")', "2000");
            setTimeout('$onlineDom.cloudTip("同步成功，2s后将自动返回游戏...")', "3000");
            setTimeout('$onlineDom.cloudTip("同步成功，1s后将自动返回游戏...")', "4000");
            setTimeout("$onlineDom.esc('_cloud')", "5000");
            return 0;
        });
    }

    //公告
    static callNotice() {
        const method = "post";
        const url = "/getNotice"
        const request = null;
        online.createLink(method, url, request, online.addNotice);
    }

    static addNotice(result) {
        $onlineDom.addNotice();
        $onlineDom.setNoticeText(result);
    }
    static removeNotice() {
        if ($onlineDom._notice) {
            $onlineDom._notice.remove();
        }
    }
}

//提示窗口
class Window_onlineInfo extends Window_Base {

    initialize(item) {
        const x = Graphics.boxWidth / 2 - 150;
        const y = Graphics.boxHeight / 2 - 75;
        const rect = new Rectangle(x, y, 300, 150);
        super.initialize(rect);
        this._item = item;
        this.refresh();
        this.createEscButton(100, 110);
    }

    refresh() {
        const txt = this._text;
        this.contents.clear();
        this.drawText(txt, 10, 10, 260, "left");
    }

    createEscButton(x, y) {
        const text = '确定';
        const fun = this.applyEsc.bind(this);
        this._intensifyButton = new Sprite_SunButton(x, y, text, fun);
        this.addChild(this._intensifyButton);
    }

    applyEsc() {
        this.hide();
        //解冻雇佣角色列表窗口，先这么写，后面优化
        if (SceneManager._scene._actorListWindow) {
            SceneManager._scene._actorListWindow.activate();
        }
        //解冻装备孔窗口待优化
        if (SceneManager._scene._slotWindow) {
            SceneManager._scene._slotWindow.activate();
        }
    }
}

//排行榜窗口
class Window_onlineRank extends Window_onlineInfo {

    initialize(item) {
        const w = sun_online_param.rankWindowsWidth;
        const x = Graphics.boxWidth / 2 - w / 2;
        const y = Graphics.boxHeight / 2 - 215;
        //xx为按钮x坐标
        const xx = w / 2 - 50;
        const rect = new Rectangle(x, y, w, 430);
        Window_Base.prototype.initialize.call(this, rect);
        this._item = item;
        this.refresh();
        this.createEscButton(xx, 390);
        this.createBackButton(10, 390);
        this.createNextButton(w - 110, 390);
        this._page = 1;
    }

    createBackButton(x, y) {
        const text = '上一页';
        const fun = this.back.bind(this);
        this._backButton = new Sprite_SunButton(x, y, text, fun);
        this.addChild(this._backButton);
    }

    createNextButton(x, y) {
        const text = '上一页';
        const fun = this.next.bind(this);
        this._backButton = new Sprite_SunButton(x, y, text, fun);
        this.addChild(this._backButton);
    }

    back() {
        if (this._page > 1) {
            this._page--;
        }
        this.refresh();
    }

    next() {
        if (this._page < this.maxPage()) {
            this._page++;
        }
        this.refresh();
    }
    maxPage() {
        return Math.ceil(online.rank.length / 10);
    }

    drawTitle() {
        const w = sun_online_param.rankWindowsWidth - 40;
        const x = 10;
        const y = 10;
        this.drawText("排名", x, y, w, "left");
        this.drawText("玩家", x, y, w, "center");
        this.drawText(sun_online_param.achievement, x, y, w, "right");
    }

    drawMyself() {
        const w = sun_online_param.rankWindowsWidth - 40;
        const x = 10;
        const y = 340;
        this.contents.textColor = ColorManager.textColor(2);
        const index = online.rank.length - 1;
        this.drawText("第" + online.rank[index].rownum + "名", x, y, w, "left");
        this.drawText(online.rank[index].name, x, y, w, "center");
        this.drawText(online.rank[index].rank, x, y, w, "right");
        this.contents.textColor = ColorManager.textColor(0);
    }

    drawRank() {
        const w = sun_online_param.rankWindowsWidth - 40;
        const x = 10;
        let y = 40;
        const indexMin = this._page * 10 - 10;
        const indexMax = this._page * 10;
        const indexMyself = online.rank.length - 1;
        const rank = online.rank.filter((user, index) => {
            if ($online.isLogon === true && index === indexMyself) return false;
            return index >= indexMin && index < indexMax;
        });
        let ranking = this._page * 10 - 9;
        for (let user of rank) {
            if (user === undefined) continue;
            if (user.name == $online.name) {
                this.contents.textColor = ColorManager.textColor(2);
            }
            this.drawText("第" + ranking + "名", x, y, w, "left");
            this.drawText(user.name, x, y, w, "center");
            this.drawText(user.rank, x, y, w, "right");
            this.contents.textColor = ColorManager.textColor(0);
            y += 30;
            ranking += 1;
        }
    }

    refresh() {
        this.contents.clear();
        this.drawTitle();
        this.drawRank();
        //判定是否是登录玩家查询，绘制的自己的成绩到窗口上
        if ($online.isLogon === true) {
            this.drawMyself();
        }
    }
}

//礼包码兑换窗口
class Window_onlineCdk extends Window_onlineInfo {

    initialize(item) {
        const x = Graphics.boxWidth / 2 - 200;
        const y = Graphics.boxHeight / 2 - 200;
        const rect = new Rectangle(x, y, 400, 400);
        Window_Base.prototype.initialize.call(this, rect);
        this._item = item;
        this.refresh();
        this.createEscButton(150, 360);
    }

    refresh() {
        this.contents.clear();
        let y = 5;
        const props = $online.cdkProps;
        this.drawText("兑换成功！", 10, y, 360, "left");
        y += 30;
        this.drawText("获得了以下道具:", 10, y, 360, "left");
        y += 40;
        for (let item of props) {
            let id = item.itemid;
            let itemData = {};
            let amount = item.num;
            switch (item.type) {
                case 'weapon': itemData = $dataWeapons[id];
                    break;
                case 'armor': itemData = $dataArmors[id];
                    break;
                case 'item': itemData = $dataItems[id];
                    break;
            }
            let iconIndex = itemData.iconIndex;
            let name = itemData.name;
            this.drawIcon(iconIndex, 10, y);
            this.drawText(name + ":", 50, y, 350, "left");
            this.drawText("x" + amount, 40, y, 320, "right");
            y += 35;
        }

    }
}

//======================================================
//====================雇佣系统场景=======================
//======================================================
//114514
//Scene_Hire 
class Scene_Hire extends Scene_Base {
    initialize() {
        super.initialize();
        this._waitCount = 0;
    };

    create() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.createWindowLayer();
        this.createActorListWindow();
        this.createHireCommandWindow();
        this._hireActor = undefined;
    };

    createActorListWindow() {
        const rect = this.actorListWindowRect();
        this._actorListWindow = new Window_ActorList(rect);
        this.addWindow(this._actorListWindow);
        this._actorListWindow.setHandler('cancel', this.onActorListCancel.bind(this));
        this._actorListWindow.setHandler("ok", this.onOk.bind(this));
    };

    createHireCommandWindow() {
        const rect = this.hireCommandWindowRect();
        this._hireCommandWindow = new Window_HireCommand(rect);
        this.addWindow(this._hireCommandWindow);
        this._hireCommandWindow.setHandler('cancel', this.onHierCancel.bind(this));
    }

    onOk() {
        const index = this._actorListWindow.index();
        this._hireActor = this._actorListWindow.itemAt(index)
        this._hireCommandWindow.refresh();
        if (this._hireCommandWindow.active === false) {
            this._hireCommandWindow.activate();
        }
    }

    onActorListCancel() {
        this.popScene();
    }

    onHierCancel() {
        if (this._actorListWindow.active === false) {
            this._actorListWindow.activate();
        }
        this._hireCommandWindow.deactivate();
    }

    actorListWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth * 0.75;
        const wh = Graphics.boxHeight;
        return new Rectangle(wx, wy, ww, wh);
    };

    hireCommandWindowRect() {
        const wx = Graphics.boxWidth * 0.75 + 1;
        const wy = 0;
        const ww = Graphics.boxWidth * 0.25 - 1;
        const wh = Graphics.boxHeight;
        return new Rectangle(wx, wy, ww, wh);
    };

    createBackground() {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [this._backgroundFilter];
        this.addChild(this._backgroundSprite);
    };

    //添加帧计数，防止连点刷新，降低服务器压力
    update() {
        Scene_Base.prototype.update.call(this);
        if (this._waitCount > 0) {
            this._waitCount--;
        }
    }
}

class Window_ActorList extends Window_Selectable {
    initialize(rect) {
        super.initialize(rect);
        this._data = [];
        this.activate();
        this.requestHireActor();
    };

    //请求雇佣角色列表
    requestHireActor() {
        const url = "/getHire";
        const tempUrl = "http://" + sun_online_param.url + url + '?t=' + Date.now();
        online.xhr.open('get', tempUrl);
        online.xhr.send();
        online.xhr.onreadystatechange = function () {
            if (online.xhr.readyState === 4) {
                if (online.xhr.status >= 200 && online.xhr.status < 300) {
                    SceneManager._scene._actorListWindow.refresh();
                }
            }
        }
    }

    maxCols() {
        return 1;
    };

    colSpacing() {
        return 16;
    };

    maxItems() {
        return this._data ? this._data.length : 1;
    };

    item() {
        return this.itemAt(this.index());
    };

    itemAt(index) {
        return this._data && index >= 0 ? this._data[index] : null;
    };

    makeItemList() {
        this._data = JSON.parse(online.xhr.responseText);
    };

    selectLast() {
        this.forceSelect(0);
    };

    drawItem(index) {
        const actor = this.itemAt(index);
        const rect = this.itemRect(index);
        const faceName = actor.faceName;
        const faceIndex = actor.faceIndex;
        const faceX = rect.x;
        const faceY = rect.y;
        if (actor) {
            this.drawFace(faceName, faceIndex, faceX, faceY, 144, 144);
        }
        const name = '名字：' + actor.user;
        const level = '等级：' + actor.level;
        const price = '价格：' + actor.price;
        this.drawText(name, rect.x + 150, rect.y + 16, 500, 'left');
        this.drawText(level, rect.x + 400, rect.y + 16, 500, 'left');
        this.drawText(price, rect.x + 150, rect.y + 48, 500, 'left');
    };

    drawFace(faceName, faceIndex, x, y, width, height) {
        width = width || ImageManager.faceWidth;
        height = height || ImageManager.faceHeight;
        const bitmap = ImageManager.loadFace(faceName);
        const pw = ImageManager.faceWidth;
        const ph = ImageManager.faceHeight;
        const sw = Math.min(width, pw);
        const sh = Math.min(height, ph);
        const dx = Math.floor(x + Math.max(width - pw, 0) / 2);
        const dy = Math.floor(y + Math.max(height - ph, 0) / 2);
        const sx = (faceIndex % 4) * pw + (pw - sw) / 2;
        const sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
        if (!bitmap.isReady()) {
            setTimeout(() => {
                this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
            }, 30)
        }
        else {
            this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
        }
    };

    itemHeight() {
        return 148;
    };

    refresh() {
        this.makeItemList();
        Window_Selectable.prototype.refresh.call(this);
    };
}

// //登记角色列表窗口
// class Window_Enroll extends Window_ActorList {
//     initialize(rect) {
//         Window_Selectable.prototype.initialize.call(this, rect);
//         this._data = [];
//         this.deactivate();
//         this.hide();
//     }

//     makeItemList() {
//         this._data = $gameParty.members();
//     };

// }

//雇佣按钮窗口
class Window_HireCommand extends Window_Selectable {

    initialize(rect) {
        super.initialize.call(this, rect);
        const x = rect.width / 2 - 50;
        const y = Graphics.boxHeight - 40;
        this.createHireButton(x, y);
        this.createCancelButton(x, y - 70);
        this.createRefreshButton(x, y - 140);
        this.createEscButton(x, y - 210);
        this.createTxt()
    };

    createTxt() {
        const ww = Graphics.boxWidth * 0.25 - 21;
        this.drawText("当前选择:", 5, 10, ww, "center");
        this.drawText("无", 5, 50, ww, "center");
    }

    createHireButton(x, y) {
        const text = '雇佣';
        const fun = this.applyHire.bind(this);
        this._hireButton = new Sprite_SunButton(x, y, text, fun);
        this.addChild(this._hireButton);
    }

    createCancelButton(x, y) {
        const text = '取消选择';
        const fun = this.cancel.bind(this);
        this._cancelButton = new Sprite_SunButton(x, y, text, fun);
        this.addChild(this._cancelButton);
    }

    createRefreshButton(x, y) {
        const text = '刷新列表';
        const fun = this.refreshList.bind(this);
        this._refreshButton = new Sprite_SunButton(x, y, text, fun);
        this.addChild(this._refreshButton);
    }

    createEscButton(x, y) {
        const text = '退出';
        const fun = this.esc.bind(this);
        this._escButton = new Sprite_SunButton(x, y, text, fun);
        this.addChild(this._escButton);
    }

    applyHire() {
        const actor = SceneManager._scene._hireActor
        const name = actor.user;
        const id = actor.id;
        if (SceneManager._scene._hireActor === undefined) {
            const txt = sun_online_param.text18;
            online.tipWindowPopup(txt);
            return;
        }
        if ($online.hire === true) {
            const txt = sun_online_param.text19;
            online.tipWindowPopup(txt);
            return;
        }
        if ($gameParty._actors.includes(id)) {
            const txt = sun_online_param.text20;
            online.tipWindowPopup(txt);
            return;
        }
        online.hireActor(name);
    }

    cancel() {
        SceneManager._scene._actorListWindow.activate();
    }

    esc() {
        SceneManager._scene.popScene();
    }

    refreshList() {
        if (SceneManager._scene._waitCount > 0) {
            const txt = sun_online_param.text21;
            online.tipWindowPopup(txt);
            //冻结角色选择窗口
            SceneManager._scene._actorListWindow.deactivate();
            return;
        }
        SceneManager._scene._actorListWindow.requestHireActor()
        SceneManager._scene._waitCount = 300;
    }

    refresh() {
        this.contents.clear();
        const ww = Graphics.boxWidth * 0.25 - 21;
        this.drawText("当前选择:", 5, 10, ww, "center");
        const name = SceneManager._scene._hireActor.user;
        this.drawText(name, 5, 50, ww, "center");
    }
}

//========================================================
//========================================================
//交易所
//114514
class exchange {

}

//114514
class Scene_Exchange extends Scene_Base {
    initialize() {
        super.initialize();
        this._waitCount = 0;
    }

    create() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.createWindowLayer();
        this.createTitleWindow();
        this.createCommandWindow();
        //this.createItemClassWindow();
        //this.createInventoryWindow();
        //this.createMyInventoryWindow();
        //this.createItemListWindow();
    }

    createTitleWindow() {
        const rect = this.titleWindowRect();
        this._titleWindow = new Window_ExchangeTitle(rect);
        this.addWindow(this._titleWindow);
    }

    titleWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = 100;
        return new Rectangle(wx, wy, ww, wh);
    }

    createCommandWindow() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_ExchangeCommand(rect);
        this.addWindow(this._commandWindow);
    }

    commandWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth * 0.15;
        const wh = Graphics.boxHeight - 100;
        return new Rectangle(wx, wy, ww, wh);
    }
}
//114514
class Window_ExchangeTitle extends Window_Base {
    initialize(rect) {
        super.initialize(rect);
        this.refresh();
    }

    refresh() {
        const txt = '欢迎来到超级大卖场'
        this.contents.fontSize = 50;
        //this.contents.textColor =
        const x = 0;
        const y = 5;
        const w = Graphics.boxWidth - 10;
        this.drawText(txt, x, y, w, "center");
    }

}

class Window_ExchangeCommand extends Window_ExchangeTitle {
    initialize(rect) {
        super.initialize(rect);
        this.refresh();
    }

    refresh() {

    }
}

//按钮精灵
function Sprite_SunButton() {
    this.initialize(...arguments);
}

Sprite_SunButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_SunButton.prototype.constructor = Sprite_SunButton;

Sprite_SunButton.prototype.initialize = function (x, y, text, fun) {
    Sprite_Clickable.prototype.initialize.call(this);
    this._clickHandler = null;
    this._coldFrame = null;
    this._hotFrame = null;
    this.setButtonBitmap(text);
    this.setupFrames();
    this.move(x, y);
    this.setClickHandler(fun);
};

Sprite_SunButton.prototype.setupFrames = function () {
    this.setColdFrame(0, 0, 100, 30);
    this.setHotFrame(0, 30, 100, 30);
    this.updateFrame();
    this.updateOpacity();
};

Sprite_SunButton.prototype.setButtonBitmap = function (text) {
    this.bitmap = new Bitmap(100, 60);
    this.bitmap.fillRect(0, 0, 100, 30, ColorManager.textColor(9));
    this.bitmap.fillRect(0, 30, 100, 30, ColorManager.textColor(8));
    this.bitmap.drawText(text, 0, 0, 100, 30, "center");
    this.bitmap.drawText(text, 0, 30, 100, 30, "center");
};

Sprite_SunButton.prototype.update = function () {
    Sprite_Clickable.prototype.update.call(this);
    this.updateFrame();
    this.updateOpacity();
    this.processTouch();
};

Sprite_SunButton.prototype.updateFrame = function () {
    const frame = this.isPressed() ? this._hotFrame : this._coldFrame;
    if (frame) {
        this.setFrame(frame.x, frame.y, frame.width, frame.height);
    }
};

Sprite_SunButton.prototype.updateOpacity = function () {
    this.opacity = this._pressed ? 255 : 192;
};

Sprite_SunButton.prototype.setClickHandler = function (method) {
    this._clickHandler = method;
};

Sprite_SunButton.prototype.setColdFrame = function (x, y, width, height) {
    this._coldFrame = new Rectangle(x, y, width, height);
};

Sprite_SunButton.prototype.setHotFrame = function (x, y, width, height) {
    this._hotFrame = new Rectangle(x, y, width, height);
};

Sprite_SunButton.prototype.onClick = function () {
    if (this._clickHandler) {
        this._clickHandler();
    } else {
        Input.virtualClick(this._buttonType);
    }
};


//登录后地图显示uid
const sun_online_createAllWindows = Scene_Message.prototype.createAllWindows;
Scene_Message.prototype.createAllWindows = function () {
    sun_online_createAllWindows.call(this);
    this.createUidWindow();
    if (Imported.sun_online_expand === true) {
        this.createChatButton();
    }
};

Scene_Message.prototype.createUidWindow = function () {
    const rect = this.uidWindowRect();
    this._uidWindow = new Window_Uid(rect);
    this.addWindow(this._uidWindow);
}

Scene_Message.prototype.uidWindowRect = function () {
    const ww = 250;
    const wh = 55;
    const wx = Graphics.boxWidth - ww;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
}

//聊天按钮
Scene_Message.prototype.createChatButton = function () {
    const x = 5;
    const y = Graphics.boxHeight - 35;
    const text = "Chat";
    const fun = this.chat.bind(this);
    this._chatButton = new Sprite_SunButton(x, y, text, fun);
    this.addChild(this._chatButton);
}


Scene_Message.prototype.chat = function () {
    online.openChat();
}

class Window_Uid extends Window_Base {
    initialize(rect) {
        super.initialize(rect);
        this.setBackgroundType(2);
        this.refresh();
    }

    refresh() {
        const uid = $online.uid === 1000000 ? '未登录' : 'uid: ' + $online.uid;
        this.contents.clear();
        this.contents.fontSize = 22;
        this.drawText(uid, 0, 0, 220, 'right');
    }

    itemPadding() {
        return 2;
    }
}

//==============插件指令=============
PluginManager.registerCommand("sun_online", "logon", online.logon);
PluginManager.registerCommand("sun_online", "password logon", online.openLogon);
PluginManager.registerCommand("sun_online", "rank", online.recordRanking);
PluginManager.registerCommand("sun_online", "openRank", online.getRanking);
PluginManager.registerCommand("sun_online", "openRankSp", online.getRankingSp);
PluginManager.registerCommand("sun_online", "cdk", online.cdk);
PluginManager.registerCommand("sun_online", "reg", online.hireEnroll);
PluginManager.registerCommand("sun_online", "openHire", online.openHire);
PluginManager.registerCommand("sun_online", "removeHire", online.removeHire);
PluginManager.registerCommand("sun_online", "cloud storage", online.cloudStorage);
PluginManager.registerCommand("sun_online", "call notice", online.callNotice);
PluginManager.registerCommand("sun_online", "remove notice", online.removeNotice);


//MD5工具
!function (n) { "use strict"; function d(n, t) { var r = (65535 & n) + (65535 & t); return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r } function f(n, t, r, e, o, u) { return d((u = d(d(t, n), d(e, u))) << o | u >>> 32 - o, r) } function l(n, t, r, e, o, u, c) { return f(t & r | ~t & e, n, t, o, u, c) } function g(n, t, r, e, o, u, c) { return f(t & e | r & ~e, n, t, o, u, c) } function v(n, t, r, e, o, u, c) { return f(t ^ r ^ e, n, t, o, u, c) } function m(n, t, r, e, o, u, c) { return f(r ^ (t | ~e), n, t, o, u, c) } function c(n, t) { var r, e, o, u; n[t >> 5] |= 128 << t % 32, n[14 + (t + 64 >>> 9 << 4)] = t; for (var c = 1732584193, f = -271733879, i = -1732584194, a = 271733878, h = 0; h < n.length; h += 16)c = l(r = c, e = f, o = i, u = a, n[h], 7, -680876936), a = l(a, c, f, i, n[h + 1], 12, -389564586), i = l(i, a, c, f, n[h + 2], 17, 606105819), f = l(f, i, a, c, n[h + 3], 22, -1044525330), c = l(c, f, i, a, n[h + 4], 7, -176418897), a = l(a, c, f, i, n[h + 5], 12, 1200080426), i = l(i, a, c, f, n[h + 6], 17, -1473231341), f = l(f, i, a, c, n[h + 7], 22, -45705983), c = l(c, f, i, a, n[h + 8], 7, 1770035416), a = l(a, c, f, i, n[h + 9], 12, -1958414417), i = l(i, a, c, f, n[h + 10], 17, -42063), f = l(f, i, a, c, n[h + 11], 22, -1990404162), c = l(c, f, i, a, n[h + 12], 7, 1804603682), a = l(a, c, f, i, n[h + 13], 12, -40341101), i = l(i, a, c, f, n[h + 14], 17, -1502002290), c = g(c, f = l(f, i, a, c, n[h + 15], 22, 1236535329), i, a, n[h + 1], 5, -165796510), a = g(a, c, f, i, n[h + 6], 9, -1069501632), i = g(i, a, c, f, n[h + 11], 14, 643717713), f = g(f, i, a, c, n[h], 20, -373897302), c = g(c, f, i, a, n[h + 5], 5, -701558691), a = g(a, c, f, i, n[h + 10], 9, 38016083), i = g(i, a, c, f, n[h + 15], 14, -660478335), f = g(f, i, a, c, n[h + 4], 20, -405537848), c = g(c, f, i, a, n[h + 9], 5, 568446438), a = g(a, c, f, i, n[h + 14], 9, -1019803690), i = g(i, a, c, f, n[h + 3], 14, -187363961), f = g(f, i, a, c, n[h + 8], 20, 1163531501), c = g(c, f, i, a, n[h + 13], 5, -1444681467), a = g(a, c, f, i, n[h + 2], 9, -51403784), i = g(i, a, c, f, n[h + 7], 14, 1735328473), c = v(c, f = g(f, i, a, c, n[h + 12], 20, -1926607734), i, a, n[h + 5], 4, -378558), a = v(a, c, f, i, n[h + 8], 11, -2022574463), i = v(i, a, c, f, n[h + 11], 16, 1839030562), f = v(f, i, a, c, n[h + 14], 23, -35309556), c = v(c, f, i, a, n[h + 1], 4, -1530992060), a = v(a, c, f, i, n[h + 4], 11, 1272893353), i = v(i, a, c, f, n[h + 7], 16, -155497632), f = v(f, i, a, c, n[h + 10], 23, -1094730640), c = v(c, f, i, a, n[h + 13], 4, 681279174), a = v(a, c, f, i, n[h], 11, -358537222), i = v(i, a, c, f, n[h + 3], 16, -722521979), f = v(f, i, a, c, n[h + 6], 23, 76029189), c = v(c, f, i, a, n[h + 9], 4, -640364487), a = v(a, c, f, i, n[h + 12], 11, -421815835), i = v(i, a, c, f, n[h + 15], 16, 530742520), c = m(c, f = v(f, i, a, c, n[h + 2], 23, -995338651), i, a, n[h], 6, -198630844), a = m(a, c, f, i, n[h + 7], 10, 1126891415), i = m(i, a, c, f, n[h + 14], 15, -1416354905), f = m(f, i, a, c, n[h + 5], 21, -57434055), c = m(c, f, i, a, n[h + 12], 6, 1700485571), a = m(a, c, f, i, n[h + 3], 10, -1894986606), i = m(i, a, c, f, n[h + 10], 15, -1051523), f = m(f, i, a, c, n[h + 1], 21, -2054922799), c = m(c, f, i, a, n[h + 8], 6, 1873313359), a = m(a, c, f, i, n[h + 15], 10, -30611744), i = m(i, a, c, f, n[h + 6], 15, -1560198380), f = m(f, i, a, c, n[h + 13], 21, 1309151649), c = m(c, f, i, a, n[h + 4], 6, -145523070), a = m(a, c, f, i, n[h + 11], 10, -1120210379), i = m(i, a, c, f, n[h + 2], 15, 718787259), f = m(f, i, a, c, n[h + 9], 21, -343485551), c = d(c, r), f = d(f, e), i = d(i, o), a = d(a, u); return [c, f, i, a] } function i(n) { for (var t = "", r = 32 * n.length, e = 0; e < r; e += 8)t += String.fromCharCode(n[e >> 5] >>> e % 32 & 255); return t } function a(n) { var t = []; for (t[(n.length >> 2) - 1] = void 0, e = 0; e < t.length; e += 1)t[e] = 0; for (var r = 8 * n.length, e = 0; e < r; e += 8)t[e >> 5] |= (255 & n.charCodeAt(e / 8)) << e % 32; return t } function e(n) { for (var t, r = "0123456789abcdef", e = "", o = 0; o < n.length; o += 1)t = n.charCodeAt(o), e += r.charAt(t >>> 4 & 15) + r.charAt(15 & t); return e } function r(n) { return unescape(encodeURIComponent(n)) } function o(n) { return i(c(a(n = r(n)), 8 * n.length)) } function u(n, t) { return function (n, t) { var r, e = a(n), o = [], u = []; for (o[15] = u[15] = void 0, 16 < e.length && (e = c(e, 8 * n.length)), r = 0; r < 16; r += 1)o[r] = 909522486 ^ e[r], u[r] = 1549556828 ^ e[r]; return t = c(o.concat(a(t)), 512 + 8 * t.length), i(c(u.concat(t), 640)) }(r(n), r(t)) } function t(n, t, r) { return t ? r ? u(t, n) : e(u(t, n)) : r ? o(n) : e(o(n)) } "function" == typeof define && define.amd ? define(function () { return t }) : "object" == typeof module && module.exports ? module.exports = t : n.md5 = t }(this);
