# Task 5 — Book Library (Async React: Effects & API)

## Запуск

```bash
cd task5
npm install
npm run dev
```

Открыть ссылку из терминала (обычно http://localhost:5173).

## Сборка для деплоя

```bash
npm run build   # готовый сайт в папке dist/
```

## Где что в коде

| Требование | Где |
|---|---|
| Fake API (Promise, задержка, ошибки, localStorage) | `src/api.js` → `fakeRequest` |
| 9 полей в деталях | `src/components/BookDetails.jsx` |
| Загрузка списка через useEffect | `App.jsx` эффект №1 |
| Create / Edit / Remove | `handleSave`, `handleDelete` |
| Загрузка деталей выбранного | `App.jsx` эффект №2 |
| Действие через API (Borrow / Return) | `handleToggle` |
| loading / error / empty / success | JSX в `App.jsx` |
| Кнопка Reload | `setReloadKey` |
| Cleanup | `ignore = true` в эффектах, `clearTimeout` в эффекте №3 |
| Race conditions | флаг `ignore` в эффекте деталей |
| Stale closures | `const id = selectedId` в начале действия + `busy` блокирует кнопки |

## Шпаргалка для защиты

- **useEffect** — запускает код после рендера (запросы, таймеры).
- **Зависимости** — эффект перезапускается, когда меняется значение из массива: `[reloadKey]`, `[selectedId, detailsKey]`, `[message]`.
- **Cleanup** — функция из `return`, вызывается перед следующим запуском эффекта и при удалении компонента.
- **Race condition** — быстро кликнуть книгу A, потом B. Ответ A может прийти позже, но cleanup уже поставил `ignore = true`, поэтому показываются только детали B.
- **Stale closure** — нажать Borrow и сразу выбрать другую книгу. `id` сохранён в начале, а обновление идёт через `prev => ...` по этому id — меняется правильная книга.
