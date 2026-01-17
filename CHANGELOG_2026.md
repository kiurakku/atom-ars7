# Changelog - Atom ARS7 (2026)

Всі помітні зміни в цьому проєкті будуть документовані в цьому файлі.

Формат базується на [Keep a Changelog](https://keepachangelog.com/uk/1.0.0/),
і цей проєкт дотримується [Semantic Versioning](https://semver.org/lang/uk/).

## [2.0.0-dev] - 2026-01-XX

### Додано
- ✅ Підтримка Electron 28.2.0 (остання стабільна версія)
- ✅ Повна інтеграція Language Server Protocol (LSP)
- ✅ Моніторинг продуктивності в реальному часі
- ✅ Покращене автодоповнення (LSP + Fuzzy search)
- ✅ Code Actions та Quick Fixes
- ✅ Breadcrumbs навігація
- ✅ Outline View для структури коду
- ✅ CI/CD автоматизація (GitHub Actions)
- ✅ Документація проєкту (FEATURES_2026.md, COMPETITIVE_FEATURES.md)
- ✅ Приклад конфігурації (config.cson.example)

### Змінено
- ✅ Оновлено Electron з 11.5.0 до 28.2.0
- ✅ Замінено `electron.remote` на `@electron/remote` 2.1.2
- ✅ Оновлено конфігурацію BrowserWindow для Electron 28
- ✅ Оновлено всі залежності до сучасних версій:
  - `async`: 3.2.5
  - `@babel/core`: 7.23.7 (замість babel-core)
  - `coffeescript`: 2.7.0 (замість coffee-script)
  - `yargs`: 17.7.2
- ✅ Додано LSP залежності
- ✅ Оновлено залежності збірки до Electron 28

### Виправлено
- ✅ Виправлено використання deprecated API
- ✅ Оновлено `allowRendererProcessReuse` для Electron 28
- ✅ Виправлено всі breaking changes

### Технічні деталі
- **Breaking Changes**: 
  - Electron 28 має нові security вимоги
  - `electron.remote` замінено на `@electron/remote`
- **Залежності**:
  - `@electron/remote: ^2.1.2`
  - `electron-chromedriver: ^28.0.0`
  - `electron-mksnapshot: ^28.0.0`
  - `electron-packager: ^18.0.0`
  - `vscode-languageserver: ^8.1.0`
- **Нові модулі**:
  - `src/language-server-client.js`
  - `src/language-server-manager.js`
  - `src/performance-monitor.js`
  - `src/modern-features.js`

---

## Плани на майбутнє

### [0.2.0] - Заплановано
- Оновлення до Electron 20.x
- Виправлення security warnings
- Оновлення native modules

### [0.3.0] - Заплановано
- Оновлення до Electron 25.x
- Повна модернізація API
- Оптимізація продуктивності

### [1.0.0] - Заплановано
- Стабільна версія з Electron 25+
- Оновлений дизайн
- CI/CD автоматизація
- Повна документація

---

**Примітка**: Цей changelog починається з початку проєкту оновлення Atom для 2026 року.
