// 引用linebot SDK & 其他需要的
var linebot = require('linebot');
var express = require('express');
var rp = require('request-promise');
var bodyParser = require('body-parser');

const SITE_NAME = "板橋"
const opts = {
    uri: "http://opendata2.epa.gov.tw/AQI.json",
    json: true
};

// 填入辨識Line Channel的資訊
var bot = linebot({
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

// 處理取得空氣品質json data
function readAQI(repose) {
    console.log('one params');
    let data;
    for (i in repose) {
        if (repose[i].SiteName == SITE_NAME) {
            data = repose[i];
            break;
        }
    }
    console.log(data);
    return data;
}
function readAQI2(repose,site_name) {
    console.log('two params');
    let data;
    for (i in repose) {
        if (repose[i].SiteName == site_name) {
            data = repose[i];
            break;
        }
    }
    console.log(data);
    return data;
}
const app = express();
app.set('view engine', 'ejs');

const linebotParser = bot.parser();
const users = ['C23de35937777d72b40c984036cf85618','Ca6f119fa33940d2456e3f3bfc835e117'];
app.get("/", function(reqs,resp) {
    // rp(opts).then(function(repos) {
    //     resp.render('app', {AQI:readAQI(repos)});
    // }).catch(function(err) {
    //     resp.send('無法取得空氣品質資料');
    // });
    // bot.push(users,'一次發送多群組');
    res.send("Hello LineBot");
});
const password = "dctv"
app.get("/pushMessage", function(reqs,resp) {
    if (reqs.query.key !== password) {
        resp.status(401).send('Error')
    }
    let message = reqs.query.message;
    let splitStr;
    if (message.indexOf('空氣品質') > -1) {
        splitStr = message.split(',');
        splitStr = splitStr[1];

    }
    
    let data;
    let response;
    rp(opts).then(function(repos) {
        console.log("call http request");
        data = readAQI2(repos,splitStr);
        response = '發佈時間: ' + data.PublishTime + 
        '\n查詢位置: ' + data.County + data.SiteName + 
        '\nPM2.5指數：' + data["PM2.5_AVG"] + 
        '\n狀態：' + data.Status
        resp.send(response);
        bot.push(users, response);
    }).catch(function(err) {
        resp.send("發生錯誤，請查明後再撥")
    });
    // resp.send("您輸入的是 => " + message);
})

// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
    console.log('message type => ' + event.message.type);
    console.log("groupId => " + event.source.groupId);
    switch (event.message.type) {
        case 'text':
        console.log('user say => ' + event.message.text)
        let userMSG = event.message.text;

          switch (event.message.text) {
             case '回升蟲,空氣品質':
             console.log('show AQI data');
               let data;
               let respMSG;
               rp(opts).then(function(repos) {
                   data = readAQI(repos);
                    respMSG = '發佈時間: ' + data.PublishTime + 
                    '\n查詢位置: ' + data.County + data.SiteName + 
                    '\nPM2.5指數：' + data["PM2.5_AVG"] + 
                    '\n狀態：' + data.Status

                event.reply('請稍等,立馬為您查詢')
                
                setTimeout(function() {
                    bot.push(event.source.groupId,respMSG);
                    },1000);
               }).catch(function(err) {
                    event.reply('無法取得空氣品質資料');
               });
               break;
             case '回升蟲,我':
             console.log('show user profile');
                 event.source.profile().then(function(profile) {
                    return event.reply('您好 ' + profile.displayName + '\n您的userId為 : ' + profile.userId);
                 });
               break;
          }
          break;
        default:
            // event.reply('未知的信息：' + JSON.stringify(event));
            break;
    }
     // setTimeout(function() {
     //        var userId = source.userId;
     //        var sendMsg = '五秒後，第一次發送信息';
     //        bot.push(source.groupId,sendMsg);
     //        console.log('send: ' + sendMsg);
     // },5000);
});

// 主動發送訊息
setTimeout(function () {
    var userId = 'Ca6f119fa33940d2456e3f3bfc835e117';
    var sendMsg = "1分鐘發送一次信息";
    bot.push(userId, [sendMsg]);
    console.log('userId: ' + userId);
    console.log('send: ' + sendMsg);
}, 1000);


app.post('/', linebotParser);
// 因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("App now running on http://%s:%s",host,port);
});
// Bot所監聽的webhook路徑與port, 此為local端運作
// bot.listen('/webhook', 3000, function () {
//     console.log('[BOT已準備就緒]');
// });


// 小圈圈 Cdbb6d8ecabb0f59d82074f8e95b15e01
// 回聲應用 Ca6f119fa33940d2456e3f3bfc835e117
// 回升應用2 C23de35937777d72b40c984036cf85618

