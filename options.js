const saveOptions = () => {
	const address = document.getElementById('address').value;
	const port = document.getElementById('port').value;

	chrome.storage.sync.set(
		{ address: address, port: port },
		() => {
			const status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(() => {
				status.textContent = 'Options failed to save.';
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