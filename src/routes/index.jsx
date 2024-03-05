import { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

export default function Home() {
    const [counter, setCounter] = useState('');
    const [userMessage, setUserMessage] = useState('');

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_ENDPOINT}/api/test/all`)
          .then(res => {
            setCounter(`Actualmente contamos con ${res.data.counter} usuarios registrados`);
            if (document.cookie.includes('user=')) { // Check if cookie exists
              return axios.get('/api/test/user');
            } else {
              return Promise.resolve({ data: { user: null } }); // Resolve with empty user data
            }
          })
          .then(res => {
                if (res.data.user) {
                    setUserMessage(`¡Hola ${res.data.user}! para ver tu perfil, haz click <a href="/profile">aquí</a>`);
                } else {
                    setUserMessage(`¡Hola! Para iniciar sesión, haz click <a href="/login">aquí</a>`);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
      <div className="container">
      <h1 className="big-text" dangerouslySetInnerHTML={{ __html: userMessage }}></h1>
      <h2>{counter}</h2>
  </div>
    );
}
