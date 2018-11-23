// 引用linebot SDK
var linebot = require('linebot');
var express = require('express');
// 填入辨識Line Channel的資訊
var bot = linebot({
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
    if (event.message.type = 'text') {
        var source = event.source
        // event.message.text是使用者傳給bot的訊息
        // 準備要回傳的內容
        var replyMsg = `Hello你剛才說的是:${event.message.text}`;
        // 透過event.reply(要回傳的訊息)方法將訊息回傳給使用者
        event.reply(replyMsg).then(function (data) {
            // 當訊息成功回傳後的處理
            console.log("sucess");
            console.log(source);
            console.log(source.userId);
        }).catch(function (error) {
            // 當訊息回傳失敗後的處理
            console.log("fail");
        }); 
        // 設定timmer執行事件
        setTimeout(function() {
            var userId = source.userId;
            var sendMsg = '五秒後，第一是發送信息';
            bot.push(userId,sendMsg);
            console.log('send: ' + sendMsg);
        },5000);
    } 
});

const app = express();
const linebotParser = bot.parser();
app.get("/", function(reqs,reps) {
    reps.send("Hello World");
});
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

