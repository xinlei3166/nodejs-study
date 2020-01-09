const model = require('../../utils/model');
let Pet = model.Pet;

(async () => {
    let p = await Pet.findByPk(33);
    console.log(p)
    p.gender = true;
    await p.save();
})();

// (async () => {
//     const p = await Pet.update({
//         gender: true,
//     }, {
//         where: {
//             id: 33
//         }
//     })
//     console.log(p)
// })();

