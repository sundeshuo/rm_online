//const { json } = require("express");
const mysql = require("mysql");
const config = require("./config.json");

const db = mysql.createPool(config.mysql);

// db.connect(function (err) {
//     if (err) {
//         console.log('mysql连接失败:' + err)
//         return
//     }
//     console.log('mysql连接成功')
// })

//GM后台
exports.gm = (req, res) => {
    const data = req.body;
    //GM密碼在此处更改！！！
    if (data.password === "RPGMAKERYYDS") {
        gmDB(res, data);
    }
    else {
        res.send("密码错误");
    }
}

gmDB = (res, data) => {
    const cdk = data.cdk;
    const uid = data.uid;
    const times = data.times;
    const sql = `select * from cdk where uid='${uid}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send("uid已存在");
            return;
        }
        const sql2 = `INSERT INTO cdk(uid, cdk, times) values('${uid}', '${cdk}', '${times}')`
        db.query(sql2, (err, result) => {
            if (err) throw err;
            res.send("添加cdk成功");
            gmItemDB(data);
        })
    })

}

gmItemDB = (data) => {
    const uid = data.uid;
    const container = data.item;
    for (let item of container) {
        const type = item.type;
        const id = item.id;
        const num = item.amount;
        if (type === undefined) continue;
        if (id === undefined) continue;
        if (num === undefined) continue;
        const sql = `INSERT INTO cdk_content(uid, type, itemid, num) values('${uid}', '${type}', '${id}', '${num}')`;
        db.query(sql, (err, result) => {
            if (err) throw err;
        })
    }
}

//简易登录
exports.userLogon = (req, res) => {
    console.log(req.body);
    const name = req.body.user;
    if (name == null) {
        res.send('101');
        return;
    }
    const sql = `select * from user where name='${name}'`;
    //const sql = "select * from user where name ='" + name + "'";
    db.query(sql, (err, result) => {
        if (err) {
            res.send('99');
            throw err
        }
        if (result.length === 0) {
            //如果查询结果为0，执行注册
            register(req, res);
        }
        else {
            //如果结果大于0，说明该名称已存在，返回名称被占用代码
            res.send('102');
        }
    })
}

register = (req, res) => {
    const name = req.body.user;
    const password = req.body.password;
    const sql = `INSERT INTO user(name, password, rank) values('${name}', '${password}', 0)`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        //返回注册成功代码
        res.send('100');
    })
}

//账号密码登录
//1.注册
exports.passwordRegister = (req, res) => {
    const name = req.body.user;
    const sql = `select * from user where name='${name}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            //如果查询结果为0，执行注册
            register(req, res);
        }
        else {
            //如果结果大于0，说明该名称已存在，返回名称被占用代码
            res.send('102');
        }
    })
}

//2.登录
exports.passwordLogon = (req, res) => {
    const name = req.body.user;
    const password = req.body.password;
    const sql = `select * from user where name='${name}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.send('103');
        }
        else {
            if (result[0].password === password) {
                res.send(result[0]);
            }
            else {
                res.send('104');
            }
        }
    })
}

//用户上传排行数据
exports.userUploadRank = (req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const rank = req.body.value;
    if (!name) {
        res.send("0");
        return;
    }
    const sql = "UPDATE rank_list SET rank = " + rank + " WHERE name = '" + name + "'";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('1');
    })
}

//向用户发送排行榜数据
exports.sendingRank = (req, res) => {
    console.log(req.body);
    let temp = [];
    const name = req.body.name;
    const sql = `SELECT * FROM rank_list ORDER BY rank DESC, time ASC LIMIT ${config.game.rankLimt}`
    db.query(sql, (err, result) => {
        if (err) throw err;
        temp = result;
        if (name) {
            addUserRank(req, res, name, temp);
        }
        else {
            res.send(result);
        }
    })

}

addUserRank = (req, res, name, temp) => {
    const sql = `SELECT b.* FROM(SELECT t.*, @rownum := @rownum + 1 AS rownum FROM(SELECT @rownum := 0) r, (SELECT * FROM rank_list ORDER BY rank DESC, time ASC) AS t) AS b WHERE b.name = '${name}'`;
    //const sql = "SELECT * FROM user WHERE name = '" + name + "'";
    db.query(sql, (err, result) => {
        if (err) throw err;
        temp.push(result[0]);
        res.send(temp);
    })
}

//向用户发送SP排行榜数据
exports.sendingRankSp = (req, res) => {
    console.log(req.body);
    let temp = [];
    const name = req.body.name;
    const sql = `SELECT * FROM rank_list_sp ORDER BY rank DESC, time ASC LIMIT ${config.game.rankLimt}`
    db.query(sql, (err, result) => {
        if (err) throw err;
        temp = result;
        if (name) {
            addUserRankSp(req, res, name, temp);
        }
        else {
            res.send(result);
        }
    })

}

addUserRankSp = (req, res, name, temp) => {
    const sql = `SELECT b.* FROM(SELECT t.*, @rownum := @rownum + 1 AS rownum FROM(SELECT @rownum := 0) r, (SELECT * FROM rank_list_sp ORDER BY rank DESC, time ASC) AS t) AS b WHERE b.name = '${name}'`;
    //const sql = "SELECT * FROM user WHERE name = '" + name + "'";
    db.query(sql, (err, result) => {
        if (err) throw err;
        temp.push(result[0]);
        res.send(temp);
    })
}

//礼包码
exports.cdk = (req, res) => {
    console.log(req.body);
    const cdk = req.body.cdk;
    const sql = "SELECT * FROM cdk WHERE cdk ='" + cdk + "'";
    let uid = null;
    db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            if (result[0].time <= 0) {
                res.send('0');
                return;
            }
            findProps(req, res, result);
            deductTimes(result);
        }
        else {
            res.send('0');
            return;
        }
    })
}

findProps = (req, res, result) => {
    uid = result[0].uid;
    const sql = "SELECT * FROM cdk_content WHERE uid ='" + uid + "'";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
}

deductTimes = (result) => {
    const newTimes = result[0].times - 1;
    const uid = result[0].uid;
    const sql = "UPDATE cdk SET times = " + newTimes + " WHERE uid = '" + uid + "'";
    db.query(sql, (err, result) => {
        if (err) throw err;
    })
}

//cdk领取日志
exports.cdkLog = (req, res) => {
    const name = req.body.name;
    const uid = req.body.uid;
    const sql = `INSERT INTO cdk_log(user, uid) values('${name}', '${uid}')`;
    db.query(sql, (err, result) => {
        if (err) throw err;
    })
}

//雇佣登记
exports.receiveActor = (req, res) => {
    const user = req.body.user;
    const data = addslashes(req.body.data);
    const price = req.body.price;
    const faceIndex = req.body.faceIndex;
    const faceName = req.body.faceName;
    const level = req.body.level;
    const id = req.body.id;
    const sql = `UPDATE hire SET actor = '${data}', price = '${price}',faceIndex = '${faceIndex}',faceName = '${faceName}',level = '${level}', id = '${id}' WHERE user = '${user}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('1');
    })
}

//发送可雇佣角色列表
exports.sendingHireActorList = (req, res) => {
    const sql = `SELECT user, price, faceIndex, faceName, level FROM hire WHERE actor IS NOT null ORDER BY RAND() limit 10`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
}

//发送雇佣角色数据
exports.sendingHireActor = (req, res) => {
    const user = req.body.user;
    const sql = `SELECT actor FROM hire WHERE user = '${user}'`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        const data = reverseAddslashes(result[0].actor);
        res.send(data);
    })
}

//用户查询云存档
exports.queryCloud = (req, res) => {
    const user = req.body.user;
    const sql = `SELECT CONVERT_TZ(time, '+00:00', '+08:00') as BJtime FROM cloud_storage WHERE USER = '${user}'`;
    db.query(sql, (err, result) => {
        if (err) {
            res.send('mysql错误');
            throw err;
        };
        if (result[0].BJtime === null) {
            res.send('无云存档');
        }
        else {
            res.send(result[0].BJtime);
        }
    })
}

//用户上传云存档
exports.receiveStorage = (req, res) => {
    const user = req.body.user;
    const data = addslashes(req.body.data);
    const sql = `UPDATE cloud_storage SET data = '${data}' WHERE user = '${user}'`;
    db.query(sql, (err, result) => {
        if (err) {
            res.send('mysql错误');
            throw err;
        };
        res.send('存档成功');
    })
}
//用户读档
exports.load = (req, res) => {
    const user = req.body.user;
    const sql = `SELECT data FROM cloud_storage WHERE user = '${user}'`;
    db.query(sql, (err, result) => {
        if (err) {
            res.send('mysql错误');
            throw err;
        };
        if (result[0].data === null) {
            res.send('无云存档');
        }
        else {
            data = reverseAddslashes(result[0].data);
            res.send(data);
        }
    })
}

//公告
exports.notice = (req, res) => {
    res.send(config.game.notice);
}

//热更新
exports.version = (req, res) => {
    res.send(config.game.version);
}

//转义
addslashes = (string) => {
    return string.replace(/\\/g, '\\\\').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"');
}

//反转义
reverseAddslashes = (string) => {
    return string.replace(/\\\\/g, '\\').
        replace(/\\b/g, '\u0008').
        replace(/\\t/g, '\t').
        replace(/\\n/g, '\n').
        replace(/\\f/g, '\f').
        replace(/\\r/g, '\r').
        replace(/\\\'/g, "'").
        replace(/\\"/g, '"');
}

exports.ceshi = (req, res) => {
    res.send("hello world");
}