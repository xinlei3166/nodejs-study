const Pet = require('../../utils/model').Pet;

// Pet.create({
//     name: 'Gaffey',
//     gender: false,
//     birth: '2007-07-07',
// }).then(function (p) {
//     console.log('created.' + JSON.stringify(p));
// }).catch(function (err) {
//     console.log('failed: ' + err);
// });

(async () => {
    try{
        const dog = await Pet.create({
            // name: 'Odie',
            gender: false,
            birth: 11111,
        });
        console.log(dog);
    } catch (e) {
        console.log('errror')
    }


})();
