const crypto = require('crypto');

var password = process.env.CRYPT_PASSWORD;
var iv = Buffer.from(process.env.IV);
var ivString = iv.toString('hex').substring(0,16);



function sha1(input) {
    return crypto.createHash('sha1').update(input).digest();
}

function passwordDeriveBytes(password, salt, iterations, len) {
    var key = Buffer.from(password + salt);
    for (var i = 0; i < iterations; i++) {
        key = sha1(key);
    }
    if (key.length < len) {
        var hx = passwordDeriveBytes(password, salt, iterations - 1, 20);
        for (var counter = 1; key.length < len; ++counter) {
            key = Buffer.concat([key, sha1(Buffer.concat([Buffer.from(counter.toString()), hx]))]);
        }
    }
    return Buffer.alloc(len, key);
}


async function encode(string) {
    var key = passwordDeriveBytes(password, '', 100, 32);
    var cipher = crypto.createCipheriv('aes-256-cbc', key, ivString);
    var part1 = cipher.update(string, 'utf8');
    var part2 = cipher.final();
    const encrypted = Buffer.concat([part1, part2]).toString('base64');
    return encrypted;
}

async function decode(string) {
    var key = passwordDeriveBytes(password, '', 100, 32);
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, ivString);
    var decrypted = decipher.update(string, 'base64', 'utf8');
    decrypted += decipher.final();
    return decrypted;
}


module.exports = { encode, decode };