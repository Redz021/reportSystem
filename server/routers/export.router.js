const fs = require('fs')
const PizZip = require('pizzip')
const docxtemplater = require('docxtemplater')

function copyFile(src, dir) {
    fs.writeFileSync(dir, fs.readFileSync(src))
}

module.exports = (app) => {
    const router = require('express').Router()
    router.use((req, res, next) => {
        if (req.admin) next()
        else res.status(403)
    })
    router.post('/evaluate', (req, res) => {
        const { student, task, score } = req.body
        console.log(student, task, score)
        const userDir = `./public/${req.user._id}`
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir)
        }
        const fileName = `${student}_${task}.docx`
        const srcDocx = './public/template.docx'
        const dirDocx = `${userDir}/${fileName}`
        if (fs.existsSync(dirDocx)) fs.unlinkSync(dirDocx)
        copyFile(srcDocx, dirDocx)

        const content = fs.readFileSync(dirDocx, 'binary')
        const zip = new PizZip(content)
        const doc = new docxtemplater()
        doc.loadZip(zip)

        const data = {}

        for (let key in score) {
            if (score[key].constructor === Object) {
                for (let k in score[key]) {
                    data[k] = score[key][k]
                }
            } else {
                data[key] = score[key]
            }
        }

        doc.setData(data)
        try {
            doc.render()
        } catch (error) {
            let err = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            }
            console.error(JSON.stringify(err))
            throw error
        }
        const buf = doc.getZip().generate({ type: 'nodebuffer' })
        fs.writeFileSync(dirDocx, buf)

        res.send(`http://localhost:3000/public/${req.user._id}/${fileName}`)
    })

    app.use('/api/export', router)
}