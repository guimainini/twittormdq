//imports
importScripts('./js/sw-util.js');

let url = window.location.href;
console.log('url', url);



const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamitic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    './',
    './index.html',
    './css/style.css',
    './img/favicon.ico',
    './img/avatars/wolverine.jpg',
    './img/avatars/hulk.jpg',
    './img/avatars/ironman.jpg',
    './img/avatars/spiderman.jpg',
    './img/avatars/thor.jpg',
    './js/app.js',
    './js/sw-util.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    './css/animate.css',
    './js/libs/jquery.js',
];

self.addEventListener('install', event => {

    const cacheStatic = caches.open( STATIC_CACHE )
        .then( cache => cache.addAll( APP_SHELL ));
    
    const cacheInmutable = caches.open( INMUTABLE_CACHE )
        .then( cache => cache.addAll( APP_SHELL_INMUTABLE ));

    event.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]) );
});

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            // static-v4
            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil( respuesta );
});

self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request).then( res => {

            if ( res ) {
                return res;
            }else{
                return fetch( e.request ).then(newRes => {
                    return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
                })
            }

        });

    e.respondWith( respuesta );

});

