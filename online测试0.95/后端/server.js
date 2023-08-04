const express = require("express");
const cors = require("cors");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: true });

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

//跨域
app.use(cors());

const router = require("./server/router.js");

//托管静态资源
app.use(express.static('www'))

app.use(router);

//启动服务
// app.listen(9000, () => {
//     console.log('服务已开启,9000端口被监听...');
// })


let onlineUsers = 0;
const map = []; //地图玩家
const playerList = {}; //在线玩家列表
const switches = []; //开关
const variables = []; //变量
const selfSwitches = {}; //独立开关

io.on('connection', (socket) => {
    onlineUsers++;
    console.log("当前在线人数：" + onlineUsers);
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function () {
        onlineUsers--;
        console.log("当前在线人数：" + onlineUsers);
        map[socket._mapId] = map[socket._mapId] || [];
        if (socket._user) {
            map[socket._mapId].remove(socket);
        }
        for (const user of map[socket._mapId]) {
            if (user._user === socket._user) continue;
            user.emit('player map leave', { "user": socket._user, "mapId": socket._mapId });
        }
    });
    //当有玩家执行传送，向目标地图所有玩家广播
    socket.on('map move', (data) => {
        if (socket._user) {
            map[socket._mapId].remove(socket);
        }
        socket._user = data.user;
        socket._mapId = data.mapId
        socket._x = data.x;
        socket._y = data.y;
        socket._actorId = data.actorId;
        map[data.mapId] = map[data.mapId] || [];
        map[data.mapId].push(socket);
        for (const user of map[data.mapId]) {
            if (user._user != data.user) {
                user.emit('transfer player', data);
            }
        }
    })
    //玩家传送新地图后获取当前地图所有其他玩家信息
    socket.on('get map player', (mapId) => {
        map[mapId] = map[mapId] || [];
        const data = [];
        for (const user of map[mapId]) {
            const obj = {
                "user": user._user,
                "x": user._x,
                "y": user._y,
                "actorId": user._actorId
            }
            data.push(obj);
        }
        socket.emit('map all player', data);
    })

    //收到玩家移动指令后，向当前地图所有玩家广播
    socket.on('player move', (data) => {
        socket._x = data.x;
        socket._y = data.y;
        map[data.mapId] = map[data.mapId] || [];
        for (const user of map[data.mapId]) {
            if (user._user === data.user) continue;
            user.emit('player move', data);
        }
    })

    //收到玩家离开地图指令后，向当前地图所有玩家广播
    socket.on('player map leave', (data) => {
        map[data.mapId] = map[data.mapId] || [];
        for (const user of map[data.mapId]) {
            if (user._user === data.user) continue;
            user.emit('player map leave', data);
        }
    })
    //当玩家上线
    socket.on('player online', (user) => {
        if (playerList[user]) {
            playerList[user].emit('other client login', "0");
        }
        playerList[user] = socket;
        const data = {};
        data.switches = switches;
        data.variables = variables;
        data.selfSwitches = selfSwitches;
        socket.emit("sync switches", data);
    })

    //云开关、变量
    socket.on('switches change', (data) => {
        switches[data.switchId] = data.value;
        socket.broadcast.emit('switches change', data);
    })
    socket.on('variables change', (data) => {
        variables[data.variableId] = data.value;
        socket.broadcast.emit('variables change', data);
    })
    socket.on('selfSwitches change', (data) => {
        selfSwitches[data.key] = data.value;
        socket.broadcast.emit('selfSwitches change', data);
    })
});

http.listen(9000, function () {
    console.log('服务已开启,9000端口被监听...');
});

Array.prototype.remove = function (element) {
    for (; ;) {
        const index = this.indexOf(element);
        if (index >= 0) {
            this.splice(index, 1);
        } else {
            return this;
        }
    }
};