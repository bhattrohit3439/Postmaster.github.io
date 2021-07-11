console.log('this is my project.');

// parameters counter
let extraParams = 0;
// hide parameter box initially
let parametersBox = document.getElementById('parametersBox');
let contentType = document.getElementById('contentType');
let requestJsonBox = document.getElementById('requestJsonBox');

// initial setting for content type, custom parameters and request json to be hidden
parametersBox.classList.add('d-none');
contentType.classList.add('d-none');
requestJsonBox.classList.add('d-none');

// if post is selected, content type and request json will be displayed
document.getElementById('post').addEventListener('click', () => {
	contentType.classList.remove('d-none');
	requestJsonBox.classList.remove('d-none');
});
// if get is selected, content type and request json gets hidden
document.getElementById('get').addEventListener('click', () => {
	contentType.classList.add('d-none');
	requestJsonBox.classList.add('d-none');
});

// if user click on param content , hide the json box
document.getElementById('customParameters').addEventListener('click', () => {
	parametersBox.classList.remove('d-none');
	document.getElementById('requestJsonBox').classList.add('d-none');
});

// if user click on JSON content , hide the param box
document.getElementById('json').addEventListener('click', () => {
	parametersBox.classList.add('d-none');
	document.getElementById('requestJsonBox').classList.remove('d-none');
});

// function to create div
function getElementFromString(string) {
	let div = document.createElement('div');
	div.innerHTML = string;
	div.classList.add('mb-3', 'row');
	return div;
}

// function to add or delete parameters
function addParameters(event) {
	if (event.target.id === 'addParameter') {
		let string = `<label for="parameter" class="my-2 col-sm-2 col-form-label">Parameters ${extraParams + 2}</label>
	<div class="my-2 col-sm-4">
		<input type="text" class="form-control" id="parameterKey${extraParams + 2}" placeholder="Enter Parameter ${
			extraParams + 2
		} Key" />
	</div>
	<div class="my-2 col-sm-4">
		<input
			type="text"
			class="form-control"
			id="parameterValue${extraParams + 2}"
			placeholder="Enter Parameter ${extraParams + 2} Value"
		/>
	</div>
	<button id="addParameter" class="my-2 col-auto btn btn-primary">+</button>
	<button id="deleteParameter" class="col-auto mx-1 my-2 btn btn-primary">-</button>`;
		let paramElement = getElementFromString(string);
		parametersBox.appendChild(paramElement);
		extraParams++;
	} else if (event.target.id === 'deleteParameter') {
		event.target.parentElement.remove();
		extraParams--;
	}
}

// add more parameters
parametersBox.addEventListener('click', addParameters);

// if the user clicks on submit button
document.getElementById('submit').addEventListener('click', () => {
	// show please wait for the response to the user
	let textArea = document.getElementById('responseJsonText');
	textArea.textContent = 'Please wait . . . . . Fetching response . . . . .';

	// fetch all the values user has entered
	let url = document.getElementById('url').value;
	let requestTypeValue = document.querySelector('input[name="requestType"]:checked').value;
	let contentTypeValue = document.querySelector('input[name="contentType"]:checked').value;

	// for get request with url
	if (requestTypeValue === 'GET') {
		// fetch json data using url
		fetch(url, {
			method: 'GET',
		})
			.then((res) => res.json())
			.then((data) => {
				textArea.textContent = '';
				data.forEach((obj) => {
					let myString = JSON.stringify(obj, null, 4);
					textArea.textContent += myString;
				});
				Prism.highlightAll();
			});
	} else {
		// if user input custom parameters instead of jSON, collect all the parameters in an object
		if (contentTypeValue === 'customParameters') {
			data = {};
			for (i = 0; i < extraParams + 1; i++) {
				if (document.getElementById(`parameterKey${i + 1}`) != null) {
					let key = document.getElementById(`parameterKey${i + 1}`).value;
					let value = document.getElementById(`parameterValue${i + 1}`).value;
					data[key] = value;
				}
			}
			data = JSON.stringify(data);
		} else {
			data = document.getElementById('requestJsonText').value;
		}

		// post the request
		fetch(url, {
			method: 'POST',
			body: data,
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})
			.then((res) => res.json())
			.then((text) => {
				textArea.textContent = '';
				textArea.textContent += JSON.stringify(text, null, 4);
				Prism.highlightAll();
			});
	}
});
