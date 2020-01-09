const product = require('../rest/product');
const a = 'sadads'
const APIError = require('../rest/rest').APIError;

module.exports = function (router) {
    router.get('/api/products', async (ctx, next) => {
        ctx.rest({
            products: product.getProducts()
        });
    })

    router.post('/api/products', async (ctx, next) => {
        var p = product.createProduct(ctx.request.body.name, ctx.request.body.manufacturer, parseFloat(ctx.request.body.price));
        ctx.rest(p);
    })

    router.delete('/api/products/:id', async (ctx, next) => {
        console.log(`delete product ${ctx.params.id}...`);
        var p = product.deleteProduct(ctx.params.id);
        if (p) {
            ctx.rest(p);
        } else {
            throw new APIError('ProductNotFound', 'product not found by id');
        }
    })

    return router
}
