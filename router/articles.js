const express = require('express')
const router = express.Router()
const db = require('../mysql')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()//获取JSON解析器中间件  
var urlencodedParser = bodyParser.urlencoded({ extended: false })//url-encoded解析器  

router.post('/getArticles', function(req, res){
    console.log(req.body)
    db.queryPage(req.body, 'articles', ['id', 'title', 'author', 'imgSrc'])
    .then(result => {
        res.send(
            JSON.stringify(
            {
                msg:'操作成功',
                success: true,
                data: result
            }
        ))
    })
    .catch(err => {
        res.send(
            JSON.stringify(
            {
                msg: err,
                success: false
            }
        ))
    })
})

router.post('/getArticles/:id', function(req, res) {
    console.log(req.params.id)
    db.query('articles', ['content'], {"id": req.params.id})
    .then(result => {
        res.send(
            {
                msg:'操作成功',
                success: true,
                data: result[0].content
            }
        )
    })
    .catch(err => {
        res.send(
            {
                msg: err,
                success: false
            }
        )
    })
})

module.exports = router;