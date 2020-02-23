const runSchedule = require('./schedule')
const express = require('express')
const app = express()
const main = require('./spider')
const url = 'https://new.qq.com/ch/emotion/'
const bodyParser = require('body-parser')
app.use(bodyParser.json())//获取JSON解析器中间件  
app.use(bodyParser.urlencoded({ extended: false }))//url-encoded解析器  

app.use("/menses", require("./router/articles"));

app.listen('3000', () => {
    console.log('listen: 3000');
    // 开启自动脚本
    // runSchedule(function() {
        main(url)
    // })
});