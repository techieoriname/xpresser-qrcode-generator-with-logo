// Import Xpresser
import xpresser = require("xpresser");

/**
 * Boot Xpresser with your config
 *
 * Get config from config.ts
 * See https://xpresserjs.com/configuration/
 */
import config = require("./config");

// Initialize Xpresser
const $ = xpresser.init(config, {exposeDollarSign: true})

$.initializeTypescript(__filename, isNode => {
    if (isNode) {
        $.config.set('paths.storage', `${isNode.ts.baseFolder}/storage/`)
    }
})

// Boot Xpresser
$.boot();

// END File
