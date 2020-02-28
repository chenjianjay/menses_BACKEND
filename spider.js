// 定时器，爬虫，入库
const fs = require('fs')
const cheerio = require('cheerio')
const eventproxy = require('eventproxy')
const express = require('express')
const app = express()
const superagent = require('superagent')
require('superagent-charset')(superagent)
const async = require('async');
const db = require('./mysql.js')

// function trim(str) {
//   return str.replace(/(^\s*)|(\s*$)/g, '').replace(/&nbsp;/g, '')
// }

//将Unicode转汉字
// function reconvert(str) {
//   str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
//     return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
//   });
//   return str
// }


function fetUrl(url, callback, preArg) {
  superagent.get(url)
    .buffer(true)
    .charset('gbk')  //该网站编码为gbk，用到了superagent-charset
    .end(function (err, res) {
      let $ = cheerio.load(res.text)
      let arr = []
      const content = $('.content-article p')
      let data = ''
      let imgSrc = ''
      content.each((idx, con)=> {
        data = $(con).find('img').attr('src')
        if (data) {
          arr.push($(con).html())
          if(imgSrc.length == 0) {
            imgSrc = data
          }
        } else {
          arr.push($(con).text().replace(/\s*/g,''))
        }
      })
      preArg.imgSrc = imgSrc
      preArg.content = arr.join('%^')
      const obj = preArg
      callback(null, obj)  //将obj传递给第四个参数中的results
    })
}

function main(url) {
  superagent.get(url)
    .buffer(true)
    .charset('gbk')  //该网站编码为gbk，用到了superagent-charset
    .end(function (err, res) {
      let $ = cheerio.load(res.text);  //res.text为获取的网页内容，通过cheerio的load方法处理后，之后就是jQuery的语法了
      let lists = $('div#List .channel_mod .list li')
      let urls = []
      lists.each((idx, li)=>{
	if(idx=='5') return false
        urls.push({
          title: $(li).find('h3 a').text(),
          author: $(li).find('.source').text(),
          url: $(li).find('h3 a').attr('href')
        })
      })
      async.mapLimit(urls, 5, function (url, callback) {
        fetUrl(url.url, callback, url)
      }, function (err, results) {
        let length = results.length
        results.some(function (result, idx) {
          db.spiderInsert(result, 'articles', idx, length)
          .then(res =>{
            console.log('入库成功')
          }).catch(err =>{
            console.log(err)
          })
        })
      })
    })
}


module.exports = main;
