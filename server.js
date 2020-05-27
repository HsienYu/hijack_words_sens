const Nonsensical = require("./nonsensical");
const nonsensical = new Nonsensical();
const axios = require('axios')
const path = require('path');


const express = require('express')
const app = express()
app.use(express.static(__dirname + '/static'));
app.use('/images', express.static(__dirname + '/images'))


global.window = {
	fetch: (path) => {
		return new Promise(function (resolve, reject) {
			require("fs").readFile(path, "utf8", function (err, data) {
				if (err) {
					reject(err);
				} else {
					resolve({
						json: () => JSON.parse(data)
					});
				}
			});
		})
	}
};
const data_file_paths = {
	noun: './data/noun.json',
	adverb: './data/adverb.json',
	adjective: './data/adjective.json',
	verb: './data/verb.json',
};

app.get('/query', (req, res) => {
	var s = nonsensical.generateSentence();
	console.log(s);
	res.send(JSON.stringify(s));
	axios.post('http://localhost:8000/query', { "caption": `${s}` })
		.catch(error => {
			console.error(error)
		})
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/view', (req, res) => {
	res.sendFile(path.join(__dirname, '/static/view.html'));
});



nonsensical.load(data_file_paths, function () {
	console.log('server running...');
	app.listen(3000);
});
