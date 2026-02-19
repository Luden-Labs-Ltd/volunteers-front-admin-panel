# Найденные «сырые» строки в админ‑панели (аудит)

Файлы и места, где ранее были прямые строки без i18n. После правок по фиче 007 оставлены для истории; при появлении новых — добавлять сюда и заменять на `t('key')`.

## Исправлено в рамках 007-admin-panel-i18n-missing

- **admin-login/ui/login-form.tsx** — ошибки валидации, label/placeholder, кнопка «Войти» → `auth.form.*`
- **admin-register/ui/register-form.tsx** — ошибки валидации, label/placeholder, кнопка → `auth.form.*`
- **category-edit/ui/edit-category-form.tsx** — ошибки, label, кнопки «Отмена»/«Сохранить» → `categories.form.*`, `common.*`
- **needy-create/ui/create-needy-form.tsx** — fallback-сообщения и placeholder телефона → `needy.form.*`
- **city-create/ui/create-city-form.tsx** — примеры координат (Tel Aviv, Jerusalem и т.д.) → `cities.form.example*`
- **widgets/layout/ui/header.tsx** — aria-label «Toggle menu» → `common.toggleMenu`

## Технические / допустимые исключения

- **skill-edit**, **skill-create** — placeholder `<svg>...</svg>` (технический пример разметки).
- **task-create** — placeholder `UUID` (идентификатор формата).
- **create-needy-form** — проверка `error.response.data.message.includes('уже существует')` (сравнение с ответом API, не UI).
