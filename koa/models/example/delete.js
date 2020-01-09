const Pet = require('../../utils/model').Pet;

(async () => {
    // const p = await Pet.findByPk(3);
    // await p.destroy();
    const p = await Pet.destroy({
        where:{
            id: 4
        }
    })
    console.log(p)
})();
