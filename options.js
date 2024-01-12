const saveOptions = () => {
	const address = document.getElementById('address').value;
	const port = document.getElementById('port').value;

	chrome.storage.sync.set(
		{ address: address, port: port },
		() => {
			const status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(() => {
				status.textContent = '';
			}, 750);
		}
	);
};

const restoreOptions = () => {
	chrome.storage.sync.get(
		{ address: '', port: '' },
		(items) => {
			document.getElementById('address').value = items.address;
			document.getElementById('port').value = items.port;
		}
	);
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);

const checkConnection = () => {
	const connection_status = document.getElementById('connection-status');
	connection_status.textContent = 'Testing...';
	chrome.storage.sync.get(
        { address: '', port: '' },
        (items) => {
            //make request url
            const requestUrl = new URL(`http://${items.address}:${items.port}/status`);
            //open a get request with fetch
            fetch(requestUrl, {
                signal: AbortSignal.timeout(8000)
            }).then((response) => {
                if (response.ok) {
                    connection_status.textContent = 'Success!';
                } else {
                	connection_status.textContent = `Failed: ${response.status} | ${response.statusText}`;
                }
            }).catch((error) => {
                if (error.name === "AbortError") {
                    connection_status.textContent = 'Failed: timeout';
                }
            });
        }
    );
}

document.getElementById('check-connection').addEventListener('click', checkConnection);

const sendDeskproApiKey = () => {
	const deskpro_api_key = document.getElementById('deskpro-api-key').value;
	const deskpro_api_key_status = document.getElementById('send-deskpro-api-key-status');
	deskpro_api_key_status.textContent = 'Sending...';
	chrome.storage.sync.get(
        { address: '', port: '' },
        (items) => {
            //make request url
            const requestUrl = new URL(`http://${items.address}:${items.port}/update-api-key`);
            //make query
            requestUrl.searchParams.set('key', encodeURIComponent(deskpro_api_key));
            requestUrl.searchParams.set('type', encodeURIComponent("deskpro"));
            //open a get request with fetch
            fetch(requestUrl, {
                signal: AbortSignal.timeout(8000)
            }).then((response) => {
                if (response.ok) {
                    deskpro_api_key_status.textContent = 'Success!';
                } else {
                	deskpro_api_key_status.textContent = `Failed: ${response.status} | ${response.statusText}`;
                }
            }).catch((error) => {
                if (error.name === "AbortError") {
                    deskpro_api_key_status.textContent = 'Failed: timeout';
                }
            });
        }
    );
}

document.getElementById('send-deskpro-api-key').addEventListener('click', sendDeskproApiKey);