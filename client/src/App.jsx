import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Використання хуків для стану
  const [labs, setLabs] = useState([]);
  const [room, setRoom] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Функція для отримання даних при завантаженні (звернення до нашого API)
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/labs');
      if (response.ok) {
        const data = await response.json();
        setLabs(data);
      }
    } catch (err) {
      console.error("Помилка при завантаженні даних:", err);
    }
  };

  // Викликаємо fetchData при першому монтуванні компонента
  useEffect(() => {
    fetchData();
  }, []);

  // Обробка відправки форми
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/labs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room, time }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Якщо сервер повернув помилку валідації
        setError(data.error || 'Помилка валідації');
      } else {
        // Динамічне оновлення інтерфейсу після успішної відповіді
        setLabs((prevLabs) => [...prevLabs, data]);
        // Очищення форми
        setRoom('');
        setTime('');
      }
    } catch (err) {
      setError('Помилка з\'єднання з сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Таблиця зайнятості лабораторій на сьогодні</h1>
      
      <div className="form-container">
        <h2>Бронювання лабораторії</h2>
        {error && <p className="error">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Номер аудиторії:</label>
            <input 
              type="text" 
              // Контрольований інпут
              value={room} 
              onChange={(e) => setRoom(e.target.value)} 
              placeholder="Наприклад: Ауд. 401а"
            />
          </div>
          
          <div className="form-group">
            <label>Час заняття:</label>
            <input 
              type="text" 
              // Контрольований інпут
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              placeholder="Наприклад: 10:00"
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Відправка...' : 'Забронювати'}
          </button>
        </form>
      </div>

      <div className="table-container">
        <h2>Розклад занять</h2>
        {labs.length === 0 ? (
          <p>Немає заброньованих лабораторій на сьогодні.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Номер аудиторії</th>
                <th>Час заняття</th>
              </tr>
            </thead>
            <tbody>
              {labs.map((lab) => (
                <tr key={lab.id}>
                  <td>{lab.room}</td>
                  <td>{lab.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
