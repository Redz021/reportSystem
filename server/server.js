const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config')
const app = express()

let corsOptions = {
    origin: ['http://localhost:8080', 'http://127.0.0.1:5500'],
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const db = require('./models')
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('数据库连接成功')
    })
    .catch((err) => {
        console.log('数据库连接失败', err)
        process.exit()
    })
require('./routers/login.router')(app)
require('./routers/student.router')(app)
require('./routers/teacher.router')(app)
require('./routers/course.router')(app)
require('./routers/scLink.router')(app)

const PORT = 3000 || process.env.PORT
app.listen(PORT, () => {
    console.log(`服务启动成功，端口${PORT}`)
})