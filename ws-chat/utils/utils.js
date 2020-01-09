function moduleExport(_) {
    let settings;
    if (process.env.NODE_ENV === 'production') {
        settings = _.production
    } else if (process.env.NODE_ENV === 'test') {
        settings = _.production
    } else {
        settings = _.development
    }
    module.exports = settings;
}

module.exports = {
    moduleExport
}
