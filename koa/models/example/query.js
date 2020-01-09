const Pet = require('../../utils/model').Pet

// Pet.findAll().then(function (data) {
//     for (let p of data) {
//         console.log(JSON.stringify(p))
//     }
// }).catch();
//
Pet.findAll({where: {id: 111}}).then(function (data) {
    console.log(data)
}).catch();

// (async () => {
//     const pets = await Pet.findAll({
//         where: {
//             name: 'Gaffey'
//         }
//     });
//     console.log(`find ${pets.length} pets:`);
//     for (let p of pets) {
//         console.log(JSON.stringify(p));
//     }
// })()

