/*:
 * @target MZ
 * @author sun
 * @plugindesc 简易网络系统
 * @url https://github.com/sundeshuo/rm_online
 * 
 * @help
 * ===================================================================================
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
 *     已弃用，有新的方案等待后续更新。一定要用的话可以使用旧版
 * 4.账号密码登录:
 *     可以使用账号密码进行注册以及登录，并且会在屏幕右下角显示登录状态，登录后会显示一个唯一
 * 且不会变的uid。
 * 5.云存档:
 *     登录后可以以当前状态存档上传到服务器，在其他设备游玩时可以使用相同账号登录游戏将存档
 * 下载回来，以实现多端无缝游玩。
 * 6.pc端自动更新:
 *     只在nw平台才会生效，需要拓展插件sun_online_updater.js，该插件也可单独使用，具体使用
 * 方法见该插件插件说明。
 * 7.聊天/同屏/云变量:
 *     需要拓展插件sun_online_expand.js，不能单独使用具体使用方法见该插件插件说明。
 * ===================================================================================
 * @command logon
 * @text 登录
 * @desc 打开注册以及登录页面
 * 
 * @command rank
 * @text 排行榜提交
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
 * @arg type
 * @type select
 * @option 普通排行榜
 * @option sp排行榜
 * @text 排行榜类型
 * @desc 打开哪种排行榜
 * @default 普通排行榜
 * 
 * @command cdk
 * @text 兑换码
 * @desc 使用兑换码
 * 
 * @command cloud storage
 * @text 云存档
 * @desc 云存档
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
 * @param Logon Settings
 * @text 登录设置
 * @type struct<Logon>
 * @default {"Remember Logon":"true","Show Uid Windows":"true","Uid Windows X":"0","Uid Windows Y":"0"}
 * @desc 登录相关的设置
 * 
 * @param Ranking Settings
 * @text 排行榜设置
 * @type struct<Ranking>
 * @default {"Achievement":"战斗力","Ranking Windows Width":"400","Myself Ranking":"true","Myself Colour":"#FFA500"}
 * @desc 排行榜相关的设置
 * 
 * @param Cloud Settings
 * @text 云存档设置
 * @type struct<Cloud>
 * @default {"In Save Place":"1"}
 * @desc 云存档相关的设置
 */

/*~struct~Logon:
 * @param Remember Logon
 * @text 保存登录状态
 * @type boolean
 * @default true
 * @desc 存档是否保存登录状态
 * 
 * @param Show Uid Windows
 * @text 显示uid窗口
 * @type boolean
 * @default true
 * @desc 是否显示uid窗口
 * 
 * @param Uid Windows X
 * @text uid窗口位置
 * @type number
 * @min 0
 * @default 0
 * @desc 如果显示uid窗口，窗口x坐标,如果填0则为默认右下角位置
 * 
 * @param Uid Windows Y
 * @text uid窗口位置
 * @type number
 * @min 0
 * @default 0
 * @desc 如果显示uid窗口，窗口y坐标，如果填0则为默认右下角位置
 */

/*~struct~Ranking:
 * @param Achievement
 * @text 排行榜成绩名称
 * @type string
 * @default 战斗力
 * @desc 你的排行榜根据什么排名，显示在排行榜上的名称
 * 
 * @param Ranking Windows Width
 * @text 排行榜窗口宽度
 * @type number
 * @min 0
 * @default 400
 * @desc 排行榜窗口的宽度
 * 
 * @param Myself Ranking
 * @text 显示自己的排名
 * @type boolean
 * @default true
 * @desc 如果已登录，是否在排行榜最下方增加一行显示自己的排名，无论自己是多少名
 * 
 * @param Myself Colour
 * @text 加重颜色
 * @type string
 * @default #FFA500
 * @desc 当显示自己的成绩时，所用的颜色
 */

/*~struct~Cloud:
 * @param In Save Place
 * @text 云存档位置
 * @type number
 * @min 1
 * @max 20
 * @default 1
 * @desc 云存档保存到存档菜单里哪个位置
 * 
 */

var Imported = Imported || {};
Imported.sun_online = true;

//====================插件参数====================
var sun_online_param = sun_online_param || {};
sun_online_param.parameters = PluginManager.parameters('sun_online_main');
sun_online_param.ip = String(sun_online_param.parameters['IP'] || 0);
sun_online_param.port = String(sun_online_param.parameters['PORT'] || 0);
sun_online_param.logonSettings = JSON.parse(sun_online_param.parameters['Logon Settings']);
sun_online_param.rankingSettings = JSON.parse(sun_online_param.parameters['Ranking Settings']);
sun_online_param.cloudSettings = JSON.parse(sun_online_param.parameters['Cloud Settings']);

sun_online_param.url = "http://" + sun_online_param.ip + ":" + sun_online_param.port;

const online_data = {}
//登录参数
online_data.rememberLogon = sun_online_param.logonSettings["Remember Logon"] === "true";
online_data.showUid = sun_online_param.logonSettings["Show Uid Windows"] === "true";
online_data.UidX = Number(sun_online_param.logonSettings['Uid Windows X'] || 0);
online_data.UidY = Number(sun_online_param.logonSettings['Uid Windows Y'] || 0);
//排行榜参数
online_data.achievement = String(sun_online_param.rankingSettings['Achievement'] || 0);
online_data.rankingWindowsWidth = Number(sun_online_param.rankingSettings['Ranking Windows Width'] || 0);
online_data.myselfRanking = sun_online_param.rankingSettings["Myself Ranking"] === "true";
online_data.myselfColour = String(sun_online_param.rankingSettings['Myself Colour'] || 0);
//云存档参数
online_data.cloudPlace = Number(sun_online_param.cloudSettings["In Save Place"] || 1)
// online_data.autoCloud = sun_online_param.cloudSettings["Continue Auto Cloud"] === "true";

//屏蔽右键菜单
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
//====================插件参数====================

$online = null;
$chat = null;
$mode = "local";
//添加css
const head = document.getElementsByTagName("head")[0];
head.insertAdjacentHTML("beforeend", "<link rel=\"stylesheet\" href=\"css/sun.css\" />");

//====================复写rm核心====================

//在游戏对象中加入$online变量
const sun_online_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function () {
    sun_online_createGameObjects.call(this);
    $online = new online();
};


//存档部分修改,保存已使用过的礼包码
const sun_online_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function () {
    const contents = sun_online_makeSaveContents.call(this);
    contents.useCdk = $online._useCdk;
    contents.isLogon = online_data.rememberLogon ? $online._isLogon : false;
    contents.name = online_data.rememberLogon ? $online._name : "游客" + Math.randomInt(10000);
    contents.uid = online_data.rememberLogon ? $online._uid : 1000000;
    contents.mode = $online._mode;
    return contents;
}

const sun_online_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function (contents) {
    sun_online_extractSaveContents.call(this, contents)
    $online._useCdk = contents.useCdk;
    $online._isLogon = contents.isLogon;
    $online._name = contents.name;
    $online._uid = contents.uid;
    $online._mode = contents.mode;
    if ($online._mode === "online") {
        online.createSocketEvent();
        online.online();
    }
}

//登录后地图显示uid以及聊天按钮
const sun_online_createAllWindows = Scene_Message.prototype.createAllWindows;
Scene_Message.prototype.createAllWindows = function () {
    sun_online_createAllWindows.call(this);
    if (online_data.showUid) {
        this.createUidWindow();
    }
    if ($online._mode === "online") {
        this.createChatButton();
    }
}

Scene_Message.prototype.createChatButton = function () {
    const x = 5;
    const y = Graphics.boxHeight - 35;
    const text = "Chat";
    const fun = this.chat.bind(this);
    this._chatButton = new Sprite_SunButton(x, y, text, fun);
    this.addChild(this._chatButton);
}

Scene_Message.prototype.chat = function () {
    if ($chat._isopen === true) return;
    $chat._isopen = true;
    $chat.open();
}


//当存在弹出窗口时，无法移动
const sun_online_isBusy = Game_Message.prototype.isBusy;
Game_Message.prototype.isBusy = function () {
    return sun_online_isBusy.call(this) || $online._isBusy;
};

//====================核心====================

class online {
    constructor() {
        this._useCdk = {};
        this._isLogon = false;
        this._uid = 1000000;
        this._name = "游客" + Math.randomInt(10000);
        this._isBusy = false;
        this._mode = $mode;
        if (Imported.sun_online_expand === true) {
            this.other = new other(); //同屏
        }
        this.logon = new sun_longon(); //登录
        this.ranking = new ranking(); //排行榜
        this.cdk = new cdk(); //兑换吗
        this.cloud = new cloudStorage(); //云存档
        this.notice = new notice(); //滚动公告
    }

    //创建连接，
    //此处利用ajax与服务器进行通信,ajax主流浏览器都支持,手机端也可以使用;
    static createLink(Method, url, request, fun) {
        // Method: 请求方法
        // url: 请求地址
        // request: 请求体(携带的数据)
        // result: 回调函数,接收到服务器的响应后执行的函数
        const xhr = new XMLHttpRequest();
        const tempUrl = sun_online_param.url + url;
        xhr.open(Method, tempUrl);
        //设置请求体,因为传输的请求数据基本都为json格式所以这里直接设置为application/json
        xhr.setRequestHeader("Content-type", "application/json");
        //监听函数
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    fun(xhr.responseText);
                    return;
                }
                online.tipWindowPopup(`连接超时，状态码${xhr.status}`);
            }
        }
        xhr.send(request);
    }

    static tipWindowPopup(text) {
        if (!SceneManager._scene._onlineTipWindow) {
            SceneManager._scene._onlineTipWindow = new Window_onlineInfo;
            SceneManager._scene.addWindow(SceneManager._scene._onlineTipWindow);
        }
        SceneManager._scene._onlineTipWindow.show();
        SceneManager._scene._onlineTipWindow._text = text;
        SceneManager._scene._onlineTipWindow.refresh();
        $online._isBusy = true;
    }

    static isWindowsPopup() {
        const scene = SceneManager._scene;
        const a = scene._onlineTipWindow ? scene._onlineTipWindow.visible : false;
        const b = scene._onlineRankWindow ? scene._onlineRankWindow.visible : false;
        const c = scene._onlineRankWindow ? scene._onlineRankWindow.visible : false;
        return (a || b || c);
    }

    static online() {
        socket.emit('player online', $online._name);
    }

    // static openChat() {
    //     $online._isBusy = true;
    //     if ($chat === null) {
    //         $chat = new chat();
    //     }
    //     if ($chat._isopen === true) return;
    //     $chat.open();
    // }

    //创建在线游戏
    static createOnlineGame() {
        $chat = new chat();
        DataManager.setupNewGame();
        SceneManager._scene._commandWindow.close();
        SceneManager._scene.fadeOutAll();
        SceneManager.goto(Scene_Map);
        $online.other = new other();
        online.createSocketEvent();
    }

    //插件指令部分
    static logon() {
        $online.logon.open();
    }

    static rank(arg) {
        $online.ranking.recordRanking(arg);
    }

    static openRank(arg) {
        if (arg.type === "普通排行榜") {
            $online.ranking.getRanking();
            return;
        }
        $online.ranking.getRankingSp();
    }

    static cdk() {
        $online.cdk.open();
    }

    static cloudStorage() {
        //使用云存档必须处于登录状态
        if ($online._isLogon != true) {
            online.tipWindowPopup("未登录");
            return;
        }
        $online.cloud.open();
    }

    static notice() {
        $online.notice.open();
    }

    static removeNotice() {
        if ($online.notice) {
            $online.notice.remove();
        }
    }

    isLogon() {
        return this._isLogon;
    }

    // //打开登录页面
    // logon() {
    //     this.logon.open();
    // }
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
        $online._isBusy = false;
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

//按钮精灵
class Sprite_SunButton extends Sprite_Clickable {
    initialize(x, y, text, fun) {
        super.initialize();
        this._clickHandler = null;
        this._coldFrame = null;
        this._hotFrame = null;
        this.setButtonBitmap(text);
        this.setupFrames();
        this.move(x, y);
        this.setClickHandler(fun);
    }

    setupFrames() {
        this.setColdFrame(0, 0, 100, 30);
        this.setHotFrame(0, 30, 100, 30);
        this.updateFrame();
        this.updateOpacity();
    }

    setButtonBitmap(text) {
        this.bitmap = new Bitmap(100, 60);
        this.bitmap.fillRect(0, 0, 100, 30, ColorManager.textColor(9));
        this.bitmap.fillRect(0, 30, 100, 30, ColorManager.textColor(8));
        this.bitmap.drawText(text, 0, 0, 100, 30, "center");
        this.bitmap.drawText(text, 0, 30, 100, 30, "center");
    }

    update() {
        Sprite_Clickable.prototype.update.call(this);
        this.updateFrame();
        this.updateOpacity();
        this.processTouch();
    }

    updateFrame() {
        const frame = this.isPressed() ? this._hotFrame : this._coldFrame;
        if (frame) {
            this.setFrame(frame.x, frame.y, frame.width, frame.height);
        }
    }

    updateOpacity() {
        this.opacity = this._pressed ? 255 : 192;
    }

    setClickHandler(method) {
        this._clickHandler = method;
    }

    setColdFrame(x, y, width, height) {
        this._coldFrame = new Rectangle(x, y, width, height);
    }

    setHotFrame(x, y, width, height) {
        this._hotFrame = new Rectangle(x, y, width, height);
    }

    onClick() {
        if (this._clickHandler) {
            this._clickHandler();
        } else {
            Input.virtualClick(this._buttonType);
        }
    }
}

//====================登录====================

function stopPropagation(event) {
    event.stopPropagation();
}

Scene_Message.prototype.createUidWindow = function () {
    const rect = this.uidWindowRect();
    this._uidWindow = new Window_Uid(rect);
    this.addWindow(this._uidWindow);
}

Scene_Message.prototype.uidWindowRect = function () {
    const ww = 250;
    const wh = 55;
    const wx = online_data.UidX === 0 ? Graphics.boxWidth - ww : online_data.UidX;
    const wy = online_data.UidY === 0 ? Graphics.boxHeight - wh : online_data.UidY;
    return new Rectangle(wx, wy, ww, wh);
}

class sun_longon {
    constructor() {
        this.isOpen = false;
        this.isBusy = false;
        // this.createContent();
    };

    createContent() {
        this._box = document.createElement('div');
        this._box.className = "container";
        this._box.innerHTML = '<div class="login-wrapper"><div class="header">登录</div><div class="tip" hidden></div><div class="form-wrapper"><input class="input-item" type="text" placeholder="用户名" autocomplete="off"><input class="input-item" type="password" placeholder="密码" autocomplete="off"><div class="btn" onclick="$online.logon.login()">Login</div></div><div class="msg"><span>没有账号?</span><a  href="javascript:void(0);" onclick="$online.logon.register()">立即注册</a></div><div class="esc_btn" onclick="$online.logon.esc()">&lt;&lt;&lt;&lt;返回游戏&gt;&gt;&gt;&gt;</div></div>';
        this.createEvent();
    }

    createEvent() {
        //移动端适配防抱死事件
        const content = [...this._box.getElementsByClassName("input-item"), ...this._box.getElementsByClassName("btn"), ...this._box.getElementsByClassName("esc_btn"), ...this._box.getElementsByClassName("msg")];
        // console.log(content);
        for (const ele of content) {
            ele.addEventListener("touchstart", stopPropagation);
            if (ele.className === "input-item") {
                ele.addEventListener("keydown", function (e) {
                    if (e.keyCode === 8) {
                        e.stopPropagation();
                    }
                })
            }
        }
    }

    tip(text) {
        const tip = this._box.getElementsByClassName("tip")[0];
        tip.innerHTML = text;
        tip.hidden = false;
    }

    inputInspect() {
        const user = this._box.getElementsByClassName("input-item")[0].value;
        const password = this._box.getElementsByClassName("input-item")[1].value;
        if (user === "") {
            this.tip("用户名不能为空");
            return false;
        }
        if (password === "") {
            this.tip("密码不能为空");
            return false;
        }
        return { "user": user, "password": md5(password) };
    }

    register() {
        if (this.inputInspect() === false) return;
        if (this.isBusy === true) {
            this.tip("请勿连续点击");
            return;
        }
        this.isBusy = true;
        const data = JSON.stringify(this.inputInspect());
        const method = "post";
        const url = "/register";
        const request = data;
        online.createLink(method, url, request, (result) => {
            this.registerResponse(result);
        })
    }

    login() {
        if (this.inputInspect() === false) return;
        if (this.isBusy === true) {
            this.tip("请勿连续点击");
            return;
        }
        this.isBusy = true;
        const data = JSON.stringify(this.inputInspect());
        const Method = "post"
        const url = "/logon_password";
        const request = data;
        online.createLink(Method, url, request, (result) => {
            this.loginResponse(result);
        })
    }

    esc() {
        if (this._timeOut) clearTimeout(this._timeOut);
        if (!this._box) {
            this._box = document.getElementsByClassName("container")[0];
        }
        this._box.remove();
        this.isOpen = false;
        this.isBusy = false;
        $online._isBusy = false;
        if (SceneManager._scene._commandWindow) {
            SceneManager._scene._commandWindow.activate();
        }
    }

    open() {
        if (this.isOpen === true) return;
        this.isOpen === true;
        $online._isBusy = true;
        if (!this._box) {
            this.createContent();
        }
        document.body.appendChild(this._box);
    }

    registerResponse(result) {
        switch (result) {
            case "99":
                this.tip("mysql错误,请检查服务器!");
                break;
            case "100":
                this.tip("恭喜！注册成功！")
                break;
            case "102":
                this.tip("用户名已存在！")
                break;
            default:
                this.tip("返回数据异常，请检查服务器错误日志！")
                break;
        }
        this.isBusy = false;
    }


    loginResponse(result) {
        switch (result) {
            case "99":
                this.tip("mysql错误,请检查服务器!");
                break;
            case "103":
                this.tip("用户名不存在！");
                break;
            case "104":
                this.tip("密码错误");
                break;
            default:
                try {
                    const data = JSON.parse(result);
                    if (data.uid) {
                        this.tip("恭喜！登录成功，5s后将自动返回游戏...");
                        $online._isLogon = true;
                        $online._name = data.name;
                        $online._uid = data.uid;
                        if (SceneManager._scene._uidWindow) {
                            SceneManager._scene._uidWindow.refresh();
                        }
                        if (Imported.sun_online_expand === true && $mode === "online") {
                            online.createOnlineGame();
                            // socket.emit('get map player', $gameMap.mapId());
                            // const data = {
                            //     "user": $online._name,
                            //     "mapId": $gameMap.mapId(),
                            //     "x": $gamePlayer.x,
                            //     "y": $gamePlayer.y,
                            //     "actorId": $gameParty.leader()._actorId
                            // }
                            // socket.emit('map move', data);
                            online.online();
                        }
                        setTimeout(() => { this.tip("恭喜！登录成功，4s后将自动返回游戏...") }, 1000);
                        setTimeout(() => { this.tip("恭喜！登录成功，3s后将自动返回游戏...") }, 2000);
                        setTimeout(() => { this.tip("恭喜！登录成功，2s后将自动返回游戏...") }, 3000);
                        setTimeout(() => { this.tip("恭喜！登录成功，1s后将自动返回游戏...") }, 4000);
                        this._timeOut = setTimeout(() => { this.esc(); }, 5000);
                    }
                } catch (error) {
                    $onlineDom.tip("服务器返回数据异常，请检查服务器错误日志！");
                }
                break;
        }
        this.isBusy = false;
    }
}



class Window_Uid extends Window_Base {
    initialize(rect) {
        super.initialize(rect);
        this.setBackgroundType(2);
        this.refresh();
    }

    refresh() {
        const uid = $online._uid === 1000000 ? '未登录' : 'uid: ' + $online._uid;
        this.contents.clear();
        this.contents.fontSize = 22;
        this.drawText(uid, 0, 0, 220, 'right');
    }

    itemPadding() {
        return 2;
    }
}

//====================排行榜====================

class ranking {
    constructor() {
        this._ranking = {};
    };

    recordRanking(arg) {
        if (!$online.isLogon()) {
            online.tipWindowPopup("请先登录");
            return;
        }
        const value = $gameVariables.value(arg.valueId);
        const name = $online._name;
        this.upload(name, value);
    }

    upload(name, value) {
        //上传数据
        const method = "post";
        const url = "/uploadRank"
        const request = JSON.stringify({ 'name': name, 'value': value });
        online.createLink(method, url, request, (result) => {
            if (result == '1') {
                online.tipWindowPopup("上传成功");
                return;
            }
            else {
                online.tipWindowPopup("上传失败");
                return;
            }
        });
    }

    //取得排行榜数据
    getRanking() {
        //如果已登录则返回的排行会带有自己的成绩
        const method = "post";
        const url = "/inquiry"
        const request = JSON.stringify({ 'name': $online._name });
        online.createLink(method, url, request, (result) => {
            this._ranking = JSON.parse(result);
            this.rankWindowPopup();
        });
    }

    //取得SP排行榜数据
    getRankingSp() {
        //如果已登录则返回的排行会带有自己的成绩
        const method = "post";
        const url = "/inquirySp"
        const request = JSON.stringify({ 'name': $online._name });
        online.createLink(method, url, request, (result) => {
            this._ranking = JSON.parse(result);
            this.rankWindowPopup();
        });
    }

    rankWindowPopup() {
        if (!SceneManager._scene._onlineRankWindow) {
            SceneManager._scene._onlineRankWindow = new Window_onlineRank();
            SceneManager._scene.addWindow(SceneManager._scene._onlineRankWindow);
        }
        SceneManager._scene._onlineRankWindow.show();
        SceneManager._scene._onlineRankWindow._page = 1;
        SceneManager._scene._onlineRankWindow.refresh();
        $online._isBusy = true;
    }
}

class Window_onlineRank extends Window_onlineInfo {

    initialize() {
        const w = online_data.rankingWindowsWidth;
        const x = Graphics.boxWidth / 2 - w / 2;
        const y = Graphics.boxHeight / 2 - 215;
        const rect = new Rectangle(x, y, w, 430);
        Window_Base.prototype.initialize.call(this, rect);
        this._data = {};
        this.createButton();
        this.refresh();
        this._page = 1;
    }

    createButton() {
        const w = online_data.rankingWindowsWidth;
        const xx = w / 2 - 50;
        this.createEscButton(xx, 390);
        this.createBackButton(10, 390);
        this.createNextButton(w - 110, 390);
    }

    createBackButton(x, y) {
        const text = '上一页';
        const fun = this.back.bind(this);
        this._backButton = new Sprite_SunButton(x, y, text, fun);
        this.addChild(this._backButton);
    }

    createNextButton(x, y) {
        const text = '下一页';
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
        const length = this._data.length - 1;
        return Math.ceil(length / 10);
    }

    drawTitle() {
        const w = online_data.rankingWindowsWidth - 40;
        const x = 10;
        const y = 10;
        this.drawText("排名", x, y, w, "left");
        this.drawText("玩家", x, y, w, "center");
        this.drawText(online_data.achievement, x, y, w, "right");
    }

    drawMyself() {
        const w = online_data.rankingWindowsWidth - 40;
        const x = 10;
        const y = 340;
        const index = this._data.length - 1;
        if (this._data[index] === null) return;
        this.contents.textColor = online_data.myselfColour;
        this.drawText("第" + this._data[index].rownum + "名", x, y, w, "left");
        this.drawText(this._data[index].name, x, y, w, "center");
        this.drawText(this._data[index].rank, x, y, w, "right");
        this.contents.textColor = ColorManager.textColor(0);
    }

    drawRank() {
        const w = online_data.rankingWindowsWidth - 40;
        const x = 10;
        let y = 40;
        const indexMin = this._page * 10 - 10;
        const indexMax = this._page * 10;
        const indexMyself = this._data.length - 1;
        const rank = this._data.filter((user, index) => {
            if ($online._isLogon === true && index === indexMyself) return false;
            return index >= indexMin && index < indexMax;
        });
        let ranking = this._page * 10 - 9;
        for (let user of rank) {
            if (user === null) continue;
            if (user.name == $online._name) {
                this.contents.textColor = online_data.myselfColour;
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
        this._data = $online.ranking._ranking;
        this.contents.clear();
        this.drawTitle();
        this.drawRank();
        //判定是否是登录玩家查询，绘制的自己的成绩到窗口上
        if ($online._isLogon === true && online_data.myselfRanking) {
            this.drawMyself();
        }
    }
}

//====================兑换码====================

class cdk {
    createContent() {
        this._box = document.createElement('div');
        this._box.className = "cdk_box";
        this._box.innerHTML = '<input type = "text" class="cdk_input" id ="cdk_input"> <button class="cdk_btn" onclick="$online.cdk.inspectCdk()"t>确定</button>'
        this.createEvent();
    }

    createEvent() {
        this._box.getElementsByClassName("cdk_input")[0].addEventListener("touchstart", stopPropagation);
        this._box.getElementsByClassName("cdk_input")[0].addEventListener("keydown", function (e) {
            if (e.keyCode === 8) {
                e.stopPropagation();
            }
        })
        this._box.getElementsByClassName("cdk_btn")[0].addEventListener("touchstart", stopPropagation);
    }

    open() {
        $online._isBusy = true;
        if (!this._box) {
            this.createContent();
        }
        document.body.appendChild(this._box);
    }

    inspectCdk() {
        const cdk = document.getElementById("cdk_input").value;
        const method = "post";
        const url = "/cdk";
        const request = JSON.stringify({ 'cdk': cdk });
        online.createLink(method, url, request, (result) => {
            if (result == '0') {
                online.tipWindowPopup("无效的礼包码");
                return;
            }
            const data = JSON.parse(result)
            if (data.length === 0) {
                online.tipWindowPopup("空礼包码");
                return;
            }
            this.gainCdkItem(data);
        })
        this.esc();
    }

    esc() {
        this._box.remove();
        $online._isBusy = false;
    }

    gainCdkItem(data) {
        const content = data;
        const name = $online._name;
        const uid = data[0].uid;
        if ($online._useCdk[uid] === true) {
            //判断是否使用过相同类型的礼包码
            online.tipWindowPopup("已经使用过同类兑换码");
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
        $online._useCdk['uid'] === true
        $online._cdkProps = data;
        this.cdkWindowPopup();
        this.recordUseCdk(uid);
        if ($online._isLogon == true) {
            this.cdkLog(name, uid);
        }
    }

    recordUseCdk(uid) {
        $online._useCdk[`${uid}`] = true;
    }

    cdkLog(name, uid) {
        const method = "post";
        const url = "/cdkLog";
        const request = JSON.stringify({ 'name': name, 'uid': uid });
        online.createLink(method, url, request, () => { console.log('日志已上传') });
    }

    cdkWindowPopup() {
        $online._isBusy = true;
        if (!SceneManager._scene._onlineCdkWindow) {
            SceneManager._scene._onlineCdkWindow = new Window_onlineCdk;
            SceneManager._scene.addWindow(SceneManager._scene._onlineCdkWindow);
        }
        SceneManager._scene._onlineCdkWindow.show();
        SceneManager._scene._onlineCdkWindow.refresh();
    }
}

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
        const props = $online._cdkProps;
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

//====================云存档====================

//存档窗口修改
const sun_online_drawTitle = Window_SavefileList.prototype.drawTitle;
Window_SavefileList.prototype.drawTitle = function (savefileId, x, y) {
    if (savefileId === online_data.cloudPlace) {
        this.drawText(TextManager.file + " " + savefileId + "(云存档)", x, y, 180);
    }
    else {
        sun_online_drawTitle.call(this, savefileId, x, y)
    }
}

const sun_online_SavefileList_isEnabled = Window_SavefileList.prototype.isEnabled;
Window_SavefileList.prototype.isEnabled = function (savefileId) {
    if (this._mode === "save" && savefileId === online_data.cloudPlace) {
        return false;
    }
    return sun_online_SavefileList_isEnabled.call(this, savefileId);
}

// //继续游戏自动读取云存档
// const sun_commandContinue = Scene_Title.prototype.commandContinue;
// Scene_Title.prototype.commandContinue = function () {
//     if (online_data.autoCloud) {
//         $online.cloud.autoCloud();
//     }
//     sun_commandContinue.call(this);
// };

class cloudStorage {
    constructor() {
        this._isOpen = false;
        this._isBusy = false;
        this._cloudTime = "获取中"
    }

    createContent() {
        this._box = document.createElement('div');
        this._box.className = "container";
        this._box.innerHTML = '<div class="login-wrapper"><div class="header">云存档</div><p class="cloud_p">服务器存档: </p><div class="tip" hidden></div><div class="btn" onclick="$online.cloud.saveGame()">上传</div><div class="btn" onclick="$online.cloud.downloadCloud()">下载</div><div class="esc_btn" onclick="$online.cloud.esc()">&lt;&lt;&lt;&lt;返回游戏&gt;&gt;&gt;&gt;</div></div>';
        this.createEvent();
    }

    createEvent() {

    }

    open() {
        if (this._isOpen === true) return;
        $online._isBusy = true;
        if (!this._box) {
            this.createContent();
        }
        document.body.appendChild(this._box);
        this._box.getElementsByClassName("tip")[0].hidden = true;
        this._isOpen = true;
        this.queryCloud();
    }

    esc() {
        if (this._timeOut) clearTimeout(this._timeOut);
        this._box.remove();
        this._isOpen = false;
        this._isBusy = false;
        $online._isBusy = false;
    }

    tip(text) {
        const tip = this._box.getElementsByClassName("tip")[0];
        tip.innerHTML = text;
        tip.hidden = false;
    }

    queryCloud() {
        const method = "post";
        const url = "/queryCloud"
        const request = JSON.stringify({ 'user': $online._name });
        online.createLink(method, url, request, (result) => {
            this._cloudTime = result;
            this.setTime();
            this._isBusy = false;
        });
    }

    autoCloud() {
        const method = "post";
        const url = "/queryCloud"
        const request = JSON.stringify({ 'user': $online._name });
        online.createLink(method, url, request, (result) => {
            if (result === "无云存档") {
                Scene_Title.prototype.commandContinue.call(this);
                return;
            }
            const method = "post";
            const url = "/load"
            const request = JSON.stringify({ 'user': $online._name });
            online.createLink(method, url, request, (result) => {
                const savefileId = online_data.cloudPlace;
                const data = result;
                const contents = JsonEx.parse(data.replace(/\n/g, '\\n').replace(/\\/g, '\\\\'));
                const saveName = DataManager.makeSavename(savefileId);
                return StorageManager.saveObject(saveName, contents).then(() => {
                    DataManager._globalInfo[savefileId] = DataManager.makeSavefileInfo();
                    DataManager.saveGlobalInfo();
                    return 0;
                }).then(() => {
                    Scene_File.prototype.onSavefileOk.call(this);
                    const savefileId = online_data.cloudPlace;
                    DataManager.loadGame(savefileId)
                        .then(() => Scene_Load.prototype.onLoadSuccess.call(this))
                        .catch(() => Scene_Load.prototype.onLoadFailure.call(this));

                })
            })
        })
    }

    setTime() {
        this._box.getElementsByClassName("cloud_p")[0].innerHTML = "服务器存档: " + this._cloudTime;
    }

    saveGame() {
        if (this._isBusy === true) {
            this.tip("请勿连续点击");
            return;
        }
        this._isBusy = true;
        $gameSystem.onBeforeSave();
        const contents = DataManager.makeSaveContents();
        const data = JsonEx.stringify(contents);
        this.sendingStorage(data);
    }

    sendingStorage(data) {
        const method = "post";
        const url = "/cloudStorage"
        const request = JSON.stringify({ 'user': $online._name, 'data': data });
        online.createLink(method, url, request, (result) => {
            this.tip(result);
            this.queryCloud();
        });
    }

    downloadCloud() {
        if (this._isBusy === true) {
            this.tip("请勿连续点击");
            return;
        }
        this._isBusy = true;
        const method = "post";
        const url = "/load"
        const request = JSON.stringify({ 'user': $online._name });
        online.createLink(method, url, request, (result) => {
            if (result === '无云存档') {
                this.tip(result);
                return;
            }
            const savefileId = online_data.cloudPlace;
            const data = result;
            const contents = JsonEx.parse(data.replace(/\n/g, '\\n').replace(/\\/g, '\\\\'));
            const saveName = DataManager.makeSavename(savefileId);
            return StorageManager.saveObject(saveName, contents).then(() => {
                DataManager._globalInfo[savefileId] = DataManager.makeSavefileInfo();
                DataManager.saveGlobalInfo();
                this.tip("同步成功，5s后将自动返回游戏...");
                setTimeout(() => { this.tip("同步成功，4s后将自动返回游戏...") }, 1000);
                setTimeout(() => { this.tip("同步成功，3s后将自动返回游戏...") }, 2000);
                setTimeout(() => { this.tip("同步成功，2s后将自动返回游戏...") }, 3000);
                setTimeout(() => { this.tip("同步成功，1s后将自动返回游戏...") }, 4000);
                this._timeOut = setTimeout(() => { this.esc() }, 5000);
                this._isBusy = false
                return 0;
            });
        })
    }
}

//====================公告====================

//公告栏应该只在地图场景显示
const sun_online_goto = SceneManager.goto;
SceneManager.goto = function (sceneClass) {
    sun_online_goto.call(this, sceneClass)
    if ($online) {
        if (sceneClass != Scene_Map) {
            $online.notice.hideNotice();
            return;
        }
        $online.notice.showNotice();
    }
}

class notice {

    createContent() {
        this._box = document.createElement('div');
        this._box.className = "ad"
        if (Utils.isNwjs()) {
            this._box.innerHTML = '<svg t="1689387652500" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1464" width="30" height="30"><path d="M747.642514 3.785143C742.500571 1.250743 736.965486 0 731.428571 0c-7.892114 0-15.714743 2.536229-22.213486 7.537371L215.464229 292.571429 36.571429 292.571429c-20.214857 0-36.571429 16.356571-36.571429 36.571429l0 365.714286c0 20.214857 16.356571 36.571429 36.571429 36.571429l178.8928 0 493.750857 285.035886C715.713829 1021.463771 723.536457 1024 731.428571 1024c5.535086 0 11.072-1.250743 16.213943-3.785143C760.107886 1014.036114 768 1001.3568 768 987.428571L768 36.571429C768 22.6432 760.107886 9.963886 747.642514 3.785143zM73.144686 365.714286l124.035657 0 0 292.571429L73.144686 658.285714 73.144686 365.714286zM694.857143 923.713829 252.035657 668.072229 235.072 658.285714l-1.322057 0L233.749943 365.714286l1.322057 0 16.963657-9.786514L694.857143 100.286171 694.857143 923.713829z" fill="#F69661" p-id="1465"></path><path d="M877.714286 219.428571c-20.214857 0-36.571429 16.356571-36.571429 36.571429l0 512c0 20.214857 16.356571 36.571429 36.571429 36.571429s36.571429-16.356571 36.571429-36.571429L914.285714 256C914.285714 235.785143 897.929143 219.428571 877.714286 219.428571z" fill="#F69661" p-id="1466"></path><path d="M987.428571 365.714286c-20.214857 0-36.571429 16.356571-36.571429 36.571429l0 219.428571c0 20.214857 16.356571 36.571429 36.571429 36.571429s36.571429-16.356571 36.571429-36.571429L1024 402.285714C1024 382.070857 1007.643429 365.714286 987.428571 365.714286z" fill="#F69661" p-id="1467"></path></svg><p class="content"><span id = "noticeSpan"></span></p>'
            return;
        }
        this._box.innerHTML = '<i class="iconfont">&#xe6db;</i><p class="content"><span id = "noticeSpan"></span></p>';
    }

    addNotice() {
        if (!this._box) {
            this.createContent();
        }
        document.body.appendChild(this._box);
        this._noticeSpan = document.getElementById("noticeSpan");
        this.showNotice();
    }

    remove() {
        this._box.remove();
    }

    setNoticeText(text) {
        if (this._box) {
            this._noticeSpan.innerHTML = text;
        }
    }

    hideNotice() {
        if (this._box) {
            this._box.style.visibility = "hidden";
        }
    }

    showNotice() {
        if (this._box) {
            this._box.style.visibility = "visible";
        }
    }

    open() {
        const method = "post";
        const url = "/getNotice"
        const request = null;
        online.createLink(method, url, request, (result) => {
            this.addNotice();
            this.setNoticeText(result);
        });
    }
}

//====================插件指令====================
PluginManager.registerCommand("sun_online_main", "logon", online.logon);
PluginManager.registerCommand("sun_online_main", "rank", online.rank);
PluginManager.registerCommand("sun_online_main", "openRank", online.openRank);
PluginManager.registerCommand("sun_online_main", "cdk", online.cdk);
PluginManager.registerCommand("sun_online_main", "cloud storage", online.cloudStorage);
PluginManager.registerCommand("sun_online_main", "call notice", online.notice);
PluginManager.registerCommand("sun_online_main", "remove notice", online.removeNotice);
//====================工具====================
!function (n) { "use strict"; function d(n, t) { var r = (65535 & n) + (65535 & t); return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r } function f(n, t, r, e, o, u) { return d((u = d(d(t, n), d(e, u))) << o | u >>> 32 - o, r) } function l(n, t, r, e, o, u, c) { return f(t & r | ~t & e, n, t, o, u, c) } function g(n, t, r, e, o, u, c) { return f(t & e | r & ~e, n, t, o, u, c) } function v(n, t, r, e, o, u, c) { return f(t ^ r ^ e, n, t, o, u, c) } function m(n, t, r, e, o, u, c) { return f(r ^ (t | ~e), n, t, o, u, c) } function c(n, t) { var r, e, o, u; n[t >> 5] |= 128 << t % 32, n[14 + (t + 64 >>> 9 << 4)] = t; for (var c = 1732584193, f = -271733879, i = -1732584194, a = 271733878, h = 0; h < n.length; h += 16)c = l(r = c, e = f, o = i, u = a, n[h], 7, -680876936), a = l(a, c, f, i, n[h + 1], 12, -389564586), i = l(i, a, c, f, n[h + 2], 17, 606105819), f = l(f, i, a, c, n[h + 3], 22, -1044525330), c = l(c, f, i, a, n[h + 4], 7, -176418897), a = l(a, c, f, i, n[h + 5], 12, 1200080426), i = l(i, a, c, f, n[h + 6], 17, -1473231341), f = l(f, i, a, c, n[h + 7], 22, -45705983), c = l(c, f, i, a, n[h + 8], 7, 1770035416), a = l(a, c, f, i, n[h + 9], 12, -1958414417), i = l(i, a, c, f, n[h + 10], 17, -42063), f = l(f, i, a, c, n[h + 11], 22, -1990404162), c = l(c, f, i, a, n[h + 12], 7, 1804603682), a = l(a, c, f, i, n[h + 13], 12, -40341101), i = l(i, a, c, f, n[h + 14], 17, -1502002290), c = g(c, f = l(f, i, a, c, n[h + 15], 22, 1236535329), i, a, n[h + 1], 5, -165796510), a = g(a, c, f, i, n[h + 6], 9, -1069501632), i = g(i, a, c, f, n[h + 11], 14, 643717713), f = g(f, i, a, c, n[h], 20, -373897302), c = g(c, f, i, a, n[h + 5], 5, -701558691), a = g(a, c, f, i, n[h + 10], 9, 38016083), i = g(i, a, c, f, n[h + 15], 14, -660478335), f = g(f, i, a, c, n[h + 4], 20, -405537848), c = g(c, f, i, a, n[h + 9], 5, 568446438), a = g(a, c, f, i, n[h + 14], 9, -1019803690), i = g(i, a, c, f, n[h + 3], 14, -187363961), f = g(f, i, a, c, n[h + 8], 20, 1163531501), c = g(c, f, i, a, n[h + 13], 5, -1444681467), a = g(a, c, f, i, n[h + 2], 9, -51403784), i = g(i, a, c, f, n[h + 7], 14, 1735328473), c = v(c, f = g(f, i, a, c, n[h + 12], 20, -1926607734), i, a, n[h + 5], 4, -378558), a = v(a, c, f, i, n[h + 8], 11, -2022574463), i = v(i, a, c, f, n[h + 11], 16, 1839030562), f = v(f, i, a, c, n[h + 14], 23, -35309556), c = v(c, f, i, a, n[h + 1], 4, -1530992060), a = v(a, c, f, i, n[h + 4], 11, 1272893353), i = v(i, a, c, f, n[h + 7], 16, -155497632), f = v(f, i, a, c, n[h + 10], 23, -1094730640), c = v(c, f, i, a, n[h + 13], 4, 681279174), a = v(a, c, f, i, n[h], 11, -358537222), i = v(i, a, c, f, n[h + 3], 16, -722521979), f = v(f, i, a, c, n[h + 6], 23, 76029189), c = v(c, f, i, a, n[h + 9], 4, -640364487), a = v(a, c, f, i, n[h + 12], 11, -421815835), i = v(i, a, c, f, n[h + 15], 16, 530742520), c = m(c, f = v(f, i, a, c, n[h + 2], 23, -995338651), i, a, n[h], 6, -198630844), a = m(a, c, f, i, n[h + 7], 10, 1126891415), i = m(i, a, c, f, n[h + 14], 15, -1416354905), f = m(f, i, a, c, n[h + 5], 21, -57434055), c = m(c, f, i, a, n[h + 12], 6, 1700485571), a = m(a, c, f, i, n[h + 3], 10, -1894986606), i = m(i, a, c, f, n[h + 10], 15, -1051523), f = m(f, i, a, c, n[h + 1], 21, -2054922799), c = m(c, f, i, a, n[h + 8], 6, 1873313359), a = m(a, c, f, i, n[h + 15], 10, -30611744), i = m(i, a, c, f, n[h + 6], 15, -1560198380), f = m(f, i, a, c, n[h + 13], 21, 1309151649), c = m(c, f, i, a, n[h + 4], 6, -145523070), a = m(a, c, f, i, n[h + 11], 10, -1120210379), i = m(i, a, c, f, n[h + 2], 15, 718787259), f = m(f, i, a, c, n[h + 9], 21, -343485551), c = d(c, r), f = d(f, e), i = d(i, o), a = d(a, u); return [c, f, i, a] } function i(n) { for (var t = "", r = 32 * n.length, e = 0; e < r; e += 8)t += String.fromCharCode(n[e >> 5] >>> e % 32 & 255); return t } function a(n) { var t = []; for (t[(n.length >> 2) - 1] = void 0, e = 0; e < t.length; e += 1)t[e] = 0; for (var r = 8 * n.length, e = 0; e < r; e += 8)t[e >> 5] |= (255 & n.charCodeAt(e / 8)) << e % 32; return t } function e(n) { for (var t, r = "0123456789abcdef", e = "", o = 0; o < n.length; o += 1)t = n.charCodeAt(o), e += r.charAt(t >>> 4 & 15) + r.charAt(15 & t); return e } function r(n) { return unescape(encodeURIComponent(n)) } function o(n) { return i(c(a(n = r(n)), 8 * n.length)) } function u(n, t) { return function (n, t) { var r, e = a(n), o = [], u = []; for (o[15] = u[15] = void 0, 16 < e.length && (e = c(e, 8 * n.length)), r = 0; r < 16; r += 1)o[r] = 909522486 ^ e[r], u[r] = 1549556828 ^ e[r]; return t = c(o.concat(a(t)), 512 + 8 * t.length), i(c(u.concat(t), 640)) }(r(n), r(t)) } function t(n, t, r) { return t ? r ? u(t, n) : e(u(t, n)) : r ? o(n) : e(o(n)) } "function" == typeof define && define.amd ? define(function () { return t }) : "object" == typeof module && module.exports ? module.exports = t : n.md5 = t }(this);
