const crypto = require('crypto')

const genRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length/2))
                    .toString('HEX')
                    .slice(0, length)
}

const sha512 = (password, salt) => {
    const hash = crypto.createHash('sha512', salt)
    hash.update(password)

    const value = hash.digest('HEX')

    return value
}

const newPassword = (userPassword) => {
    const salt = genRandomString(16)
    const hasedPassword = sha512(userPassword, salt)

    return { hasedPassword, salt }
}

const saltHashPassword = (userPassword, salt) => {
    const hasedPassword = sha512(userPassword, salt)

    return { hasedPassword }
}

module.exports = (password, salt) => {
    if(salt) {
        const { hasedPassword } = saltHashPassword(password, salt)
        return { hasedPassword }
    } else {
        const { hasedPassword, salt } = newPassword(password)
        return { hasedPassword, salt }
    }

}
