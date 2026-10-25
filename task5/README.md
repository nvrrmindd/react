# Task 5 — Book Library (Async React: Effects & API)

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
