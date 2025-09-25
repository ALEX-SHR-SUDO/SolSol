# SolSol

dApp на Solana для создания токенов через web-интерфейс.

## Функционал
- Подключение кошелька Phantom (или другого Solana-совместимого)
- Форма создания токена: имя, символ, дробность, количество
- Создание токена через Solana RPC (SPL-токен)

## Быстрый старт

1. Клонируйте репозиторий:
    ```bash
    git clone https://github.com/ALEX-SHR-SUDO/SolSol.git
    cd SolSol
    ```

2. Запустите автоматическую установку зависимостей и старт:
    ```bash
    ./setup.sh
    ```

3. Откройте frontend на http://localhost:3000

---

## Структура проекта

- frontend/ — React-приложение
- backend/ — Express-сервер

---

## Скрипты

В корне проекта находится файл setup.sh, который автоматически:
- Устанавливает зависимости в frontend и backend
- Запускает backend на порту 4000
- Запускает frontend на порту 3000

---

## Ручной запуск (если скрипт не сработал)

### Backend
```bash
cd backend
npm install
npm run start
```

### Frontend
```bash
cd frontend
npm install
npm start
```