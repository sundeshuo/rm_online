/*:
 * @target MZ
 * @author sun
 * @plugindesc 简易网络系统-热更新(PC)
 * 
 * @param updater url
 * @text 更新地址
 * @type string
 * @default 1.2.3.4:9000
 * @desc 在线更新的url地址
 * 
 * @param version
 * @text 版本号
 * @type number
 * @default 0
 * @desc 版本号
 * 
 * @help
 * 使用方法：
 * 1.准备工作：将“在线更新用客户端替换文件”文件夹中的文件粘贴到游戏根目录，覆盖；
 * 2.rm工程设置：设置插件参数中的版本号，每次更新之后将此参数修改，必须比旧版本的数字大，同时更新文件必须附带此插件js；
 * 3.服务端设置：
 *   a.将配置文件config.json文件中的"version"参数改为你设置的版本号，此步骤完成，客户端
 *   即可检测到更新；
 *   b.之后将有更新的全部文件按照原始的文件结构压缩成zip文件（必须是zip），名字改为updatar，之后将此
 *   updatar.zip文件上传到服务端www文件夹下，此步骤完成，整个配置过程结束，客户端即可检测到更新并下载
 *   更新补丁解压覆盖。
 * 
 */

var Imported = Imported || {};
Imported.sun_online_updater = true;

var sun_online_updater_param = sun_online_updater_param || {};
sun_online_updater_param.parameters = PluginManager.parameters('sun_online_updater');
sun_online_updater_param.updaterUrl = String(sun_online_updater_param.parameters['updater url'] || 0);
sun_online_updater_param.versiont = Number(sun_online_updater_param.parameters['version'] || 0);

//====================复写rm核心====================
const sun_online_title_create = Scene_Title.prototype.create;
Scene_Title.prototype.create = function () {
    sun_online_title_create.call(this);
    if (Utils.isNwjs()) {
        this.createUpdaterWindow();
        this.createUpdaterButton();
    }
}


//新函数
Scene_Title.prototype.createUpdaterWindow = function () {
    const rect = this.updaterWindowRect();
    this._infoWindow = new Window_updaterInfo(rect);
    this.addWindow(this._infoWindow);
}

Scene_Title.prototype.updaterWindowRect = function () {
    const ww = 800;
    const wh = 400;
    const wx = Graphics.boxWidth / 2 - 400;
    const wy = Graphics.boxHeight / 2 - 200;
    return new Rectangle(wx, wy, ww, wh);
}

Scene_Title.prototype.createUpdaterButton = function () {
    const x = Graphics.boxWidth - 110;
    const y = Graphics.boxHeight - 30;
    const text = "检查更新";
    const fun = this.updater.bind(this);
    this._updaterButton = new Sprite_SunButton(x, y, text, fun);
    this.addChild(this._updaterButton);
}

Scene_Title.prototype.updater = function () {
    this._updaterButton.hide();
    this._commandWindow.deactivate();
    this._infoWindow.show();
}

class Window_updaterInfo extends Window_Base {
    initialize(rect) {
        super.initialize(rect);
        // this.setBackgroundType(1);
        this._infoTextY = 10;
        this._wait = 0;
        this.hide();
        this.drawBack();
        this.createSprite();
        this.refresh();
        this.drawBaseInfo();
        this.createButton();
        this.getVersion();
    }

    refresh() {
        this.resetting();
        this.contents.fontSize = 35;
        this.drawText("在线更新", 20, 10, 760, "center")
    }

    drawBack() {
        this.contents.fillRect(38, 60, 700, 240, '#BEBEBE');
    }

    createSprite() {
        this.createInfoSprite();
        this.createGaugeSprite();
        this.createPaceSprite();
    }

    createButton() {
        this.createUpdaterButton();
        this.createEscButton();
    }

    createInfoSprite() {
        const bitmap = new Bitmap(700, 240);
        bitmap.fontFace = $gameSystem.mainFontFace();
        bitmap.fontSize = 22;
        bitmap.textColor = '#F75000';
        this._infoSprite = new Sprite(bitmap);
        this._infoSprite.move(50, 70);
        this.addChild(this._infoSprite);
    }

    createGaugeSprite() {
        const bitmap = new Bitmap(580, 30);
        bitmap.fillRect(0, 0, 580, 30, '#FFFFFF');
        bitmap.fillRect(2, 2, 576, 26, '#4F4F4F');
        this._gaugeSprite = new Sprite(bitmap);
        this._gaugeSprite.move(50, 340);
        this.addChild(this._gaugeSprite);
    }

    createPaceSprite() {
        const bitmap = new Bitmap(580, 30);
        // bitmap.fillRect(2, 2, 576, 26, '#FFFFFF');
        this._paceSprite = new Sprite(bitmap);
        this._paceSprite.move(50, 340);
        this.addChild(this._paceSprite);
    }

    drawBaseInfo() {
        const text1 = "客户端版本：" + sun_online_updater_param.versiont;
        const text2 = "服务器版本获取中...";
        this.drawInfo(text1);
        this.drawInfo(text2);
    }

    updateBaseInfo(version) {
        this._infoTextY = 10;
        this._infoSprite.bitmap.clear();
        const text1 = "客户端版本：" + sun_online_updater_param.versiont;
        const text2 = "服务器版本：" + version;
        this.drawInfo(text1);
        this.drawInfo(text2);
    }

    createUpdaterButton() {
        const x = 650;
        const y = 340;
        const text = "立即更新";
        const fun = this.updater.bind(this);
        this._updaterButton = new Sprite_SunButton(x, y, text, fun);
        this.addChild(this._updaterButton);
        this._updaterButton.hide();
    }

    createEscButton() {
        const x = 650;
        const y = 340;
        const text = "退出";
        const fun = this.esc.bind(this);
        this._escButton = new Sprite_SunButton(x, y, text, fun);
        this.addChild(this._escButton);
        this._escButton.hide();
    }

    drawInfo(text) {
        const bitmap = this._infoSprite.bitmap;
        bitmap.drawText(text, 5, this._infoTextY, 790, 22, 'left');
        this._infoTextY += 30;
    }

    refreshGauge(rate, speed) {
        const bitmap = this._paceSprite.bitmap;
        const w = Math.round(rate * 580);
        bitmap.clear();
        bitmap.fillRect(0, 0, w, 30, '#FFFFFF');
        const txt = Math.round(rate * 100) + "%";
        bitmap.drawText(txt, 0, 2, 550, 24, 'right');
        const txt2 = Math.round(speed) + "kb/s";
        bitmap.drawText(txt2, 20, 2, 400, 24, 'left');
    }

    updater() {
        this.download();
        this._updaterButton.hide();
    }

    esc() {
        this.hide();
        SceneManager._scene._commandWindow.activate();
    }

    getVersion() {
        this.drawInfo("正在向服务器获取版本号...");
        const xhr = new XMLHttpRequest();
        const url = "http://" + sun_online_updater_param.updaterUrl + "/version";
        xhr.open('get', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    //服务器版本获取成功
                    const version = Number(xhr.responseText);
                    if (SceneManager._scene._infoWindow) {
                        SceneManager._scene._infoWindow.compareVersions(version);
                    }
                    return;
                }
                if (SceneManager._scene._infoWindow) {
                    SceneManager._scene._infoWindow.drawInfo("连接失败...");
                    SceneManager._scene._infoWindow._escButton.show();
                }
            }
        }
        xhr.send();
    }

    compareVersions(version) {
        this.updateBaseInfo(version);
        const gameVersion = sun_online_updater_param.versiont;
        if (version == gameVersion) {
            this.drawInfo("已是最新版本，无需更新...");
            this._escButton.show();
        }
        else if (version > gameVersion) {
            //有新版本
            this.drawInfo("有新版本，是否更新？");
            this._updaterButton.show();
        }
        else {
            //未知情况
            this._infoWindow.drawInfo("版本获取失败，请稍后再试...");
            this._escButton.show();
        }
    }

    download() {
        SceneManager._scene._infoWindow.drawInfo("已获取到补丁文件，下载中请稍后...");
        SceneManager._scene._infoWindow._lastTime = Date.now();
        const xhr = new XMLHttpRequest();
        const url = "http://" + sun_online_updater_param.updaterUrl + "/updatar.zip";
        xhr.open('get', url);
        xhr.responseType = 'blob';
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const blob = new Blob([xhr.response], { type: xhr.response.type });
                    SceneManager._scene._infoWindow.saveFile(blob);
                    return;
                }
                SceneManager._scene._infoWindow.drawInfo("失败，请稍后再试...");
            }
        }
        //监听下载事件
        xhr.addEventListener("progress", function (evt) {
            //已加载字节数
            let loaded = evt.loaded;
            // 总字节数
            let total = evt.total;
            let rate = loaded / total;
            // 设置刷新间隔
            const interval = 10;
            const infoWindow = SceneManager._scene._infoWindow;
            infoWindow._wait++;
            //计算速度
            if (infoWindow._wait >= interval) {
                const time = Date.now();
                const changeTime = time - infoWindow._lastTime;
                console.log(infoWindow._lastTime);
                console.log(time);
                const speed = loaded / changeTime;
                infoWindow.refreshGauge(rate, speed);
                infoWindow._wait = 0;
            }
        })
        xhr.send();
    }

    saveFile(Blob) {
        Blob.arrayBuffer().then((arrayBuffer) => {
            const buffer = Buffer.from(arrayBuffer);
            const fs = require('fs');
            fs.writeFile('./updatar.zip', buffer, (err) => {
                if (err) throw err;
                this.drawInfo("更新下载完成，请等待解压缩完成...");
                this.unZip();
            });
        });
    }

    unZip() {
        const compressing = require('compressing');
        compressing.zip.uncompress('./updatar.zip', './').then(res => {
            this.drawInfo("解压完毕，更新已完成，重启游戏后生效...");
            this.drawInfo("5s后游戏将自动关闭...");
            setTimeout("nw.App.quit()", "5000");

        }).catch(err => {
            console.log(err);
        })
    }

    resetting() {
        this._infoTextY = 10;
        this.contents.clear();
        this._infoSprite.bitmap.clear();
    }
}

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