//background.js
function errorAlert() {
    alert('Must be in a Jira or DeskPro issue!');
}

const printRequest = (ticketKey, source) => {
    //make request url
    const requestUrl = new URL(`http://129.21.235.201:2194/print`);
    //make query
    requestUrl.searchParams.set('key', encodeURIComponent(ticketKey));
    requestUrl.searchParams.set('source', encodeURIComponent(source));
    //open a get request with fetch
    fetch(requestUrl);
    console.log('request sent');
};

chrome.action.onClicked.addListener((tab) => {
    if ((tab.url.includes("jira.cad.rit.edu") && tab.url.includes("PR3D-")) || tab.url.includes("fablab.cad.rit.edu")) {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['getKey.js']
        });
    } else {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: errorAlert
        });
    }
});

chrome.runtime.onMessage.addListener(
  (request, sender, senderResponse) => {
    switch (request.message) {
        case 'print_jira':
            printRequest(request.data, 'jira');
            break;
        case 'print_deskpro':
            printRequest(request.data, 'deskpro');
            break;
        default:
    }
  }
);

{
    let key = scrapeTicketKey();
    let host = window.location.host;
    var message;

    switch (host) {
        case "jira.cad.rit.edu":
            message = "print_jira";
            break;
        case "fablab.cad.rit.edu":
            message = "print_deskpro";
            break;
        default:
    }

    chrome.runtime.sendMessage({ message: message, data: key });

    function scrapeTicketKey() {
        //get url path elements
        let pathArray = window.location.href.split('/');
        //return last element
        return pathArray[pathArray.length - 1];
    }
}