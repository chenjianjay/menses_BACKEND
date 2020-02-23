const mysql = require('mysql')
let db = {}
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'shuaige520',
    database: 'menses',
    port: 3306
})

db.spiderInsert = function(result, table, idx, length) {
    return new Promise((resolve, reject) => {
        pool.query(`insert into ${table} set ?`, result, function (error, results) {
            if (error) {
                reject(error.message)
            } else {
                resolve()
            }
        })
    })
}

db.queryPage = function(body, table, colsArr) {
    return new Promise((resolve, reject) => {
        const cols = colsArr.join(',')
        const start = (body.pageBegin -1) * body.pageNum
        const sql = `select ${cols} from ${table} where id between ${start} and ${start + body.pageNum} limit ${start ? body.pageNum : body.pageNum-1}`
        console.log(sql)
        pool.query(sql, function(error, result) {
            if (error) {
                reject(error.message)
            } else {
                resolve(JSON.parse(JSON.stringify(result)))
            }
        })
    })
}

db.query = function(table, colsArr, where) {
    return new Promise((resolve, reject) => {
        const cols = colsArr.join(',')
        let sql = `select ${cols} from ${table}`
        if (where) {
            const keys = Object.keys(where)
            let len = keys.length
            while(len--) {
                sql += ` where ${keys[len]} = ${where[keys[len]]} and`
            }
            sql = sql.slice(0, -4)
        }
        pool.query(sql, function(error, result) {
            if (error) {
                reject(error.message)
            } else {
                resolve(JSON.parse(JSON.stringify(result)))
            }
        })
    })
}
db.end = function(fn){
    pool.end(fn)
}
module.exports = db;