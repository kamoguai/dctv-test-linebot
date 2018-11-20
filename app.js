// 引用linebot SDK
var linebot = require('linebot');

// 填入辨識Line Channel的資訊
var bot = linebot({
    channelId: '1621605839',
    channelSecret: '7b8132d843d318d74a87e3f28a8dfecb',
    channelAccessToken: '+KZhm8BtUaRT6gPzU08vL2e2RzgDQtwtTChRRZ7BCZ9c2WjWlBYd8XYKJzL+NHF5TlTMdAw5hQMLgZ7+YwMzZTwrjJ8w8KPEO0vTHa4VBfqTDnXrclak7VWQyxna2B2u3n1OfWOFO1l3slLBXQyfaQdB04t89/1O/w1cDnyilFU='
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
        setTimeout(function() {
            var userId = source.userId;
            var sendMsg = '五秒後，第一是發送信息';
            bot.push(userId,sendMsg);
            console.log('send: ' + sendMsg);
        },5000);
    } 
});

// Bot所監聽的webhook路徑與port
bot.listen('/webhook', 3000, function () {
    console.log('[BOT已準備就緒]');
});

