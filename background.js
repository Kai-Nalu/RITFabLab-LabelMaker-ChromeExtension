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
        displayError('invalidSite');
    }
});

function printRequest(ticketKey, source) {
    //get raspberry pi ip address and port from options
    chrome.storage.sync.get(
        { address: '', port: '' },
        (items) => {
            if (optionsValid(items)) {
                displayError('invalidOptions');
            } else {
                //make request url
                const requestUrl = new URL(`http://${items.address}:${items.port}/print`);
                //make query
                requestUrl.searchParams.set('key', encodeURIComponent(ticketKey));
                requestUrl.searchParams.set('source', encodeURIComponent(source));
                //open a get request with fetch
                fetch(requestUrl, {
                    signal: AbortSignal.timeout(8000)
                }).then((response) => {
                    if (response.ok) {
                        console.log('request sent');
                    } else {
                        displayError('failedRequest');
                    }
                }).catch((error) => {
                    if (error.name === "AbortError") {
                        displayError('timeoutRequest');
                    }
                });
            }
        }
    );
}

function displayError(type) {
    message = {
        'invalidSite': "Must be in a Jira or DeskPro issue!",
        'invalidOptions': "Raspberry Pi IP Address or Port not specified. Specify in extenstion options.",
        'failedRequest': "Request failed. Check Raspberry Pi IP Address and Port settings or check Raspberry Pi.",
        'timeoutRequest': "Request timeout. Check Raspberry Pi IP Address and Port settings or check Raspberry Pi."
    };

    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'labelIcon.png',
        title: 'Label Maker Error',
        message: message[type] || '...',
        priority: 2
    });
}

function optionsValid(items) {
    return typeof items.address === 'undefined' || typeof items.port === 'undefined' || items.address === '' || items.port === '';
}