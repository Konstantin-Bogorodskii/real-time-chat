import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LongPolling = () => {
	const [messages, setMessages] = useState([]);
	const [value, setValue] = useState('');

	useEffect(() => {
		subscribe();
	}, []);

	const subscribe = async () => {
		try {
			const { data } = await axios.get('http://localhost:5000/get-messages');
			console.log('data ==>', data);
			setMessages(prev => [data, ...prev]);
			// после получения data соединение с сервером было прервано, поэтому переподписываемся
			await subscribe();
		} catch (e) {
			// Чаще всего в блок catch мы будем попадать, когда время подписки истечёт, потому необходимо заново переподписаться
			setTimeout(() => {
				subscribe();
			}, 500);
		}
	};

	const sendMessage = async () => {
		await axios.post('http://localhost:5000/new-messages', {
			message: value,
			id: Date.now()
		});
	};

	return (
		<div className="center">
			<div>
				<div className="form">
					<input
						value={value}
						onChange={e => setValue(e.target.value)}
						type="text"
					/>
					<button onClick={sendMessage}>Отправить</button>
				</div>
				<div className="messages">
					{messages.map(mess => (
						<div
							className="message"
							key={mess.id}>
							{mess.message}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default LongPolling;
