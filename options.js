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