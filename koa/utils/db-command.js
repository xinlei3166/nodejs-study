module.exports = {
    get: (model, options) => model.findOne(options),
    getById: (model, id) => model.findByPk(id),
    filter: (model, options) => model.findAll(options),
    create: async (model, options) => {
        try {
            return await model.create(options)
        } catch (e) {
        }
    },
    update: (model, values, options) => model.update(values, options),  // [0] [1]
    delete: (model, options) => model.destroy(options)  // 0 1
}
