var job2=function (r) {
    log('Done: ' + r);
};
var job3=function (reason) {
    log('Failed: ' + reason);
};

var job1 = new Promise(function (resolve, reject) {
    log('start new Promise...');
    var timeOut = Math.random() * 2;
    log('set timeout to: ' + timeOut + ' seconds.');
    setTimeout(function () {
        if (timeOut < 1) {
            log('call resolve()...');
            resolve('200 OK');
        }
        else {
            log('call reject()...');
            reject('timeout in ' + timeOut + ' seconds.');
        }
    }, timeOut * 1000);
}).then(job2).catch(job3);
console.log(job1 instanceof Promise);
console.log(typeof(job1));
//console.log(typeof(job1.then(job2)));
console.log(typeof(job2));
console.log(job2 instanceof Promise);
// console.log(typeof(job1.then(job3)));
console.log(typeof(job3));
console.log(job3 instanceof Promise);
