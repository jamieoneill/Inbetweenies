window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(`${window.location.href}sw.js`)
            .then( registration => {
            // Registration was successful
            //console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(err => {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    }
});