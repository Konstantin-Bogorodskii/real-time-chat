const express = require('express');
const cors = require('cors');
const events = require('events');

const PORT = 5000;

const emitter = new events.EventEmitter();

const app = express();

app.use(cors());
// подключаем парсер json на сервере
// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());

app.get('/connect', (request, response) => {
	response.writeHead(200, {
		'connection': 'keep-alive',
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache'
	})
	emitter.on('newMessage', (message) => {
		response.write(`data: ${JSON.stringify(message)} \n\n`)
	})
});

app.post('/new-messages', (request, response) => {
	const message = request.body;

	emitter.emit('newMessage', message);

	response.status(200);
});

app.listen(PORT, () => {
	console.log('started on port ==>', PORT);
});