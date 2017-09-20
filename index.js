/**
 * Main application entry point.
 *
 * @author Yaroslav Surilov <y.surilov@infomir.com>
 */

'use strict';


class Preloader {
    /**
     * @param {Object[]} loadStuff resources for loading
     * @param {(function|null)} [onReject=null] callback when operation fails
     * @param {(function|null)} [onResolve=null] callback when operation succeed
     *
     * @constructor
     */
    constructor ( loadStuff, onReject = null, onResolve = null ) {
        this.loadStuff = loadStuff;
        this.onReject  = onReject;
        this.onResolve = onResolve;
    }
}

module.exports = Preloader;
