let cacheName = "v2";
let cacheFiles = [
    './',
    './index.html',
    './css/my_style.css',
    './css/styles.css',
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',
    './img/10.jpg',
    './js/dbhelper.js',
    './js/main.js',
    // 'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
    // 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAK4MvTMepWBj5LXL1ZsDReMxMCYJQHRVk&libraries=places&callback=initMap',
    // 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
    '/data/restaurants.json',
];

self.addEventListener('install',function (e) {
    console.log("[ Service Worker Installed ]");

    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("Service Worker caching cache files");

            return cache.addAll(cacheFiles);
        })
    )
});
self.addEventListener('activate',function (e) {
    console.log("[ Service Worker Activated ]");

    e.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (thisCacheName) {
                if(thisCacheName != cacheName){
                    console.log("Service worker removing cached files from ",thisCacheName);
                    return caches.delete(thisCacheName);
                }
            }))
        })
    )
});
self.addEventListener('fetch', function(evt) {
    console.log('The service worker is serving the asset.');
    evt.respondWith(fromCache(evt.request).catch(function () {
        return fromNetwork(evt.request, 400);
    }));
});

function fromNetwork(request, timeout) {
    return new Promise(function (fulfill, reject) {
        let timeoutId = setTimeout(reject, timeout);
        fetch(request).then(function (response) {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}
function fromCache(request) {
    return caches.open(cacheName).then(function (cache) {
        return cache.match(request).then(function (matching) {
            console.log("[Following found in cache] "+request.url);
            return matching || Promise.reject('no-match');
        });
    });
}