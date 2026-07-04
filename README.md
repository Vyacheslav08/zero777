# Подбор рулевых реек

Сайт для подбора рулевых реек по VIN + ИИ-консультант на Claude API.

## Запуск через Docker

1. Скопируй `.env.example` в `.env` и впиши свой ключ Anthropic:
   ```
   cp .env.example .env
   ```
2. Собери и запусти:
   ```
   docker compose up --build -d
   ```
3. Открой в браузере: `http://localhost:3000`

Остановить: `docker compose down`

## Переменные окружения

| Переменная | Описание |
|---|---|
| `ANTHROPIC_API_KEY` | Ключ Claude API (console.anthropic.com) |

## Деплой на сервер

На своём VPS: установить Docker, скопировать эту папку целиком, положить `.env` с ключом, выполнить `docker compose up --build -d`. Порт 3000 нужно будет пробросить через nginx/reverse proxy на 80/443 с доменом.

## Локальный запуск без Docker

```
npm install
node server.js
```
