/**
 * Your Config File.
 * See https://xpresserjs.com/configuration/
 */
module.exports = {
    // name of app
    name: 'Xpresser-Simple-Typescript-App',

    // app environment
    env: 'development',

    /**
     * By default xpresser sets this for you.
     */
    server: {
        domain: 'localhost',
        // Server Port
        port: 3000,
    },

    /**
     * Path settings.
     */
    paths: {
        /**
         * Base Folder
         * Where this app is called from.
         *
         * Best value for this is: __dirname
         */
        base: __dirname,

        /**
         * Point routes file to routes.ts
         */
        routesFile: "backend://routes.ts"
    }
};