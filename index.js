/**
 * Main application entry point.
 *
 * @author Yaroslav Surilov <y.surilov@infomir.com>
 */

'use strict';

let queueSize = 0,
    groups    = {};


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


/**
 *
 * @param {function} resolve
 * @param {function} reject
 */
function handler ( resolve, reject ) {
    queueSize--;
    groups[this.group]--;

    // one link is done
    if ( preloader.events['link'] ) {
        // notify listeners
        preloader.emit('link', {url: this.src, group: this.group});
    }

    // the whole group is done
    if ( groups[this.group] === 0 ) {
        console.log('[preloader] group "' + this.group + '" loaded');
        // one link is done
        if ( preloader.events['group'] ) {
            // notify listeners
            preloader.emit('group', {name: this.group});
        }
    }

    // everything is done
    if ( queueSize === 0 ) {
        console.log('[preloader] done');
        // all links are done
        resolve(0);
    }
}


/**
 * Clear and fill the router with the given list of pages.
 *
 * @param {Array} links list of urls to load
 *
 * @example
 * preloader.addListener('link', function ( data ) { console.log(data.url, data.group); });
 * preloader.addListener('group', function ( data ) { console.log(data.name); });
 * preloader.addListener('done', function () { console.log('ok'); });
 *
 * preloader.add([
 *     'http://pic.uuhy.com/uploads/2011/09/01/Painting-Of-Nature.png',
 *     'https://perishablepress.com/wp/wp-content/themes/wire/img/jeff-starr.jpg',
 *     {url: 'http://www.phpied.com/files/reflow/dyna1.png', group:'qwe'},
 *     {url: 'http://www.phpied.com/files/reflow/dyna3.png', group:'qwe'},
 *     'http://www.phpied.com/files/reflow/render.wrong.extension'
 * ]);
 */
function add ( resolve, reject, links ) {
    const linksLoader = new Promise(() => {}),
        groupsLoader  = new Promise(() => {});


    if ( !Array.isArray(links) ) {
        throw new Error('Wrong argument links');
    }

    // walk through all the given links
    classifyLinks(links).forEach(function ( item ) {
        const img   = new Image(),
            url     = item.url   || item,
            group   = item.group || '';


        if ( typeof url !== 'string' ) {
            throw new Error('Wrong url type');
        }
        if ( typeof group !== 'string' ) {
            throw new Error('Wrong group type');
        }
        if ( url.trim() === '' ) {
            throw new Error('Empty url');
        }

        queueSize += 1;
        groups[group] = groups[group] === undefined ? 1 : groups[group] + 1;

        // build tag
        img.src    = url;
        img.group  = group;

        img.onload = img.onerror = img.ontimeout = handler.bind(null, resolve, reject);
    });
}


// public
module.exports = new Promise(() => {
    add.bind(null, ...arguments);
    handler.bind(null, ...arguments);
});
