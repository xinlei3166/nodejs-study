// function F() {
//     this.a = 1;
// }
//
// F.prototype.show = function () {
//     console.log(this.a)
// };
//
// f1 = new F();
//
// f1.show = function () {
//     console.log(2)
// };
//
// // f1.__proto__.show = function () {
// //     console.log(2)
// // };
//
// f2 = new F();
//
// f1.show();
// f2.show();

setTimeout(function () {
    console.log(5)
}, 100)

new Promise(function () {
    console.log(3)
}).then(
    setTimeout(function () {
        console.log(4)
    }, 200)
)

console.log(1)
