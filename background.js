//background.js

chrome.action.onClicked.addListener((tab) => {
    const currentURL = tab.url;
    const currentURLConstruct = new URL(currentURL);

    const url_host = currentURLConstruct.host;

    const path_array = currentURL.split('/');
    const last_path_element = path_array[path_array.length - 1];

    const regexPattern = /^(PR3D-)?\d+$/;
    if (regexPattern.test(last_path_element)) {
        let ticketKey = last_path_element;
        var source;

        if (url_host.startsWith('jira')) {
            source = 'jira';
        } else if (url_host.startsWith('fablab')) {
            source = 'deskpro';
        } else {
            source = 'deskpro';
        }

        printRequest(ticketKey, source);
    } else {
        errorAlert();
    }
});

function errorAlert() {
    alert('Must be in a Jira or DeskPro issue!');
}

function printRequest(ticketKey, source) {
    //make request url
    const requestUrl = new URL(`http://129.21.235.201:2194/print`);
    //make query
    requestUrl.searchParams.set('key', encodeURIComponent(ticketKey));
    requestUrl.searchParams.set('source', encodeURIComponent(source));
    //open a get request with fetch
    fetch(requestUrl);
    console.log('request sent');
}