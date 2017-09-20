/**
 * Main application entry point.
 *
 * @author Yaroslav Surilov <y.surilov@infomir.com>
 */

'use strict';


/**
 * Parse given links for classifying by resource type.
 *
 * @param {Object[]} links links of external resources for loading
 *
 * @return {Object} classified resources
 */
function classifyLinks ( links ) {
    const resources = {};

    links.forEach(link => {
        switch ( link.split('.').pop() ) {
            case 'js':
                resources.scripts = resources.scripts || [];
                resources.scripts.push(link);
                break;
            case 'css':
                resources.styles = resources.styles || [];
                resources.styles.push(link);
                break;
            default:
                resources.images = resources.images || [];
                resources.images.push(link);
        }
    });

    return resources;
}


class Preloader extends Promise {
    /**
     * @param {Object[]} links=[] resources for loading
     * @param {(function|null)} [onReject=null] callback when operation fails
     * @param {(function|null)} [onResolve=null] callback when operation succeed
     *
     * @constructor
     */
    constructor ( links = [], onReject = null, onResolve = null ) {
        super();

        this.links     = classifyLinks(links);
        this.onReject  = onReject;
        this.onResolve = onResolve;
    }
}


module.exports = Preloader;
