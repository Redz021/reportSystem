const bcrypt = require('bcrypt')
module.exports = {
    url: 'mongodb://localhost:27017/reportSystem',
    secretKey: 'ababababababababab',
    originalPassword: '111111',
    getEncryptedPassword: async(pwd) =>
        (password = await bcrypt.hash(pwd, await bcrypt.genSalt(10))),
}