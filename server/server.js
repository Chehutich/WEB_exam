const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Шлях до окремого файлу з даними
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Допоміжна функція для читання даних з файлу
const readLabsData = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Помилка читання файлу:", error);
    return [];
  }
};

// Допоміжна функція для запису даних у файл
const writeLabsData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Помилка запису файлу:", error);
  }
};

// GET: Отримання повного списку
app.get('/api/labs', (req, res) => {
  const labs = readLabsData();
  res.json(labs);
});

// POST: Додавання нового об'єкта
app.post('/api/labs', (req, res) => {
  const { room, time } = req.body;

  // Обов'язкова валідація полів
  if (!room || typeof room !== 'string' || room.trim().length < 2) {
    return res.status(400).json({ error: "Некоректний номер аудиторії (мінімум 2 символи)" });
  }

  if (!time || typeof time !== 'string' || time.trim().length < 4) {
    return res.status(400).json({ error: "Некоректний час (наприклад, 10:00)" });
  }

  // Читаємо актуальні дані з файлу
  const labs = readLabsData();

  const newLab = {
    id: Date.now(),
    room: room.trim(),
    time: time.trim()
  };

  labs.push(newLab);
  
  // Зберігаємо оновлені дані назад у файл
  writeLabsData(labs);

  res.status(201).json(newLab); // 201 Created
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
