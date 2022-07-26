const baseRoute = require('./base/baseRoutes')
const {join} = require('path')

class UtilRoute extends baseRoute {
    coverage() {
        return {
            options: {
                auth: false,
                description: 'Retorna a cobertura do código',
                notes: 'Coverage',
                tags: ['api'],
            },
            path: '/coverage/{param*}',
            method: 'GET',
            handler: {
                directory: {
                    path: join(__dirname, '../../coverage/'),
                    redirectToSlash: true,
                    index: true
                }
            }
        }
    }
}

module.exports = UtilRoute