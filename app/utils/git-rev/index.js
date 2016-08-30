const exec = require('child_process').exec,
    moment = require('moment'),
    BbPromise = require('bluebird');

function _command (cmd) {
    return new BbPromise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(new Error(err));
            } else {
                resolve(stdout.split('\n').join(''));
            }
        });
    });
}

module.exports = { 
    getShort : function () { 
        return _command('git rev-parse --short HEAD');
    },
    
    getLong : function () { 
        return _command('git rev-parse HEAD');
    },
    
    getBranch : function () { 
        return _command('git rev-parse --abbrev-ref HEAD');
    },
    
    getTag : function () { 
        return _command('git describe --always --tag --abbrev=0');
    },
    
    getLog : function () { 
        return _command('git log --no-color --pretty=format:\'[ "%H", "%s", "%cr", "%an" ],\' --abbrev-commit', function (str) {
            str = str.substr(0, str.length-1);
            return JSON.parse('[' + str + ']');
        });
    },
    
    getLastCommitDate: function () {
        return moment(_command('git log -1 --date=short --pretty=format:%cd')).format('L');
    }
}