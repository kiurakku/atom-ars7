# Atom ARS7 - Atom Revival 2026

[![Electron Version](https://img.shields.io/badge/Electron-28.2.0-blue.svg)](https://www.electronjs.org/)
[![Node Version](https://img.shields.io/badge/Node-18.x%2B-green.svg)](https://nodejs.org/)
[![LSP Support](https://img.shields.io/badge/LSP-Supported-brightgreen.svg)](https://microsoft.github.io/language-server-protocol/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)](https://github.com/features/actions)

> **Atom Revival Project 2026** - Оживлення Atom editor для сучасних операційних систем

Це форк Atom editor, який оновлюється для роботи в 2026 році. Проєкт включає оновлення Electron, виправлення залежностей та модернізацію коду для сумісності з сучасними системами.

## 🚀 Статус проєкту

**Поточний етап**: Повне оновлення для конкурентоспроможності в 2026

- ✅ Оновлено Electron до версії 28.2.0 (остання стабільна)
- ✅ Додано підтримку Language Server Protocol (LSP)
- ✅ Додано моніторинг продуктивності
- ✅ Покращене автодоповнення (LSP + Fuzzy)
- ✅ Code Actions та Quick Fixes
- ✅ Breadcrumbs навігація
- ✅ Outline View
- ✅ CI/CD автоматизація
- ✅ Оновлені всі залежності
- 🔄 В процесі: Тестування та фінальні виправлення

## 📋 Документація

- [ROADMAP.md](ROADMAP.md) - Детальний план оновлення
- [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) - Інструкції зі збірки
- [FEATURES_2026.md](FEATURES_2026.md) - Нові функції для 2026
- [COMPETITIVE_FEATURES.md](COMPETITIVE_FEATURES.md) - Конкурентні переваги
- [UPGRADE_LOG.md](UPGRADE_LOG.md) - Лог змін
- [NEXT_STEPS.md](NEXT_STEPS.md) - Наступні кроки

## 🔧 Швидкий старт

```bash
# Клонувати репозиторій
git clone <your-fork-url>
cd atom-ars7

# Встановити залежності
npm install

# Зібрати проєкт
npm run build

# Запустити Atom
./atom.sh  # Linux/macOS
atom.cmd   # Windows
```

Детальні інструкції дивіться в [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md).

---

**Оригінальний опис:**

Atom is a hackable text editor for the 21st century, built on [Electron](https://github.com/electron/electron), and based on everything we love about our favorite editors. We designed it to be deeply customizable, but still approachable using the default configuration.

> ⚠️ **Примітка**: Оригінальний Atom був заархівований 15 грудня 2022. Цей форк продовжує розвиток проєкту.

![Atom](https://user-images.githubusercontent.com/378023/49132477-f4b77680-f31f-11e8-8357-ac6491761c6c.png)

![Atom Screenshot](https://user-images.githubusercontent.com/378023/49132478-f4b77680-f31f-11e8-9e10-e8454d8d9b7e.png)

Visit [atom.io](https://atom.io) to learn more or visit the [Atom forum](https://github.com/atom/atom/discussions).

Follow [@AtomEditor](https://twitter.com/atomeditor) on Twitter for important
announcements.

This project adheres to the Contributor Covenant [code of conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior to atom@github.com.

## Documentation

If you want to read about using Atom or developing packages in Atom, the [Atom Flight Manual](https://flight-manual.atom.io) is free and available online. You can find the source to the manual in [atom/flight-manual.atom.io](https://github.com/atom/flight-manual.atom.io).

The [API reference](https://atom.io/docs/api) for developing packages is also documented on Atom.io.

## Installing

### Prerequisites
- [Git](https://git-scm.com)

### macOS

Download the latest [Atom release](https://github.com/atom/atom/releases/latest).

Atom will automatically update when a new release is available.

### Windows

Download the latest [Atom installer](https://github.com/atom/atom/releases/latest). `AtomSetup.exe` is 32-bit. For 64-bit systems, download `AtomSetup-x64.exe`.

Atom will automatically update when a new release is available.

You can also download `atom-windows.zip` (32-bit) or `atom-x64-windows.zip` (64-bit) from the [releases page](https://github.com/atom/atom/releases/latest).
The `.zip` version will not automatically update.

Using [Chocolatey](https://chocolatey.org)? Run `cinst Atom` to install the latest version of Atom.

### Linux

Atom is only available for 64-bit Linux systems.

Configure your distribution's package manager to install and update Atom by following the [Linux installation instructions](https://flight-manual.atom.io/getting-started/sections/installing-atom/#platform-linux) in the Flight Manual.  You will also find instructions on how to install Atom's official Linux packages without using a package repository, though you will not get automatic updates after installing Atom this way.

#### Archive extraction

An archive is available for people who don't want to install `atom` as root.

This version enables you to install multiple Atom versions in parallel. It has been built on Ubuntu 64-bit,
but should be compatible with other Linux distributions.

1. Install dependencies (on Ubuntu):
```sh
sudo apt install git libasound2 libcurl4 libgbm1 libgcrypt20 libgtk-3-0 libnotify4 libnss3 libglib2.0-bin xdg-utils libx11-xcb1 libxcb-dri3-0 libxss1 libxtst6 libxkbfile1
```
2. Download `atom-amd64.tar.gz` from the [Atom releases page](https://github.com/atom/atom/releases/latest).
3. Run `tar xf atom-amd64.tar.gz` in the directory where you want to extract the Atom folder.
4. Launch Atom using the installed `atom` command from the newly extracted directory.

The Linux version does not currently automatically update so you will need to
repeat these steps to upgrade to future releases.

## Building

* [Linux](https://flight-manual.atom.io/hacking-atom/sections/hacking-on-atom-core/#platform-linux)
* [macOS](https://flight-manual.atom.io/hacking-atom/sections/hacking-on-atom-core/#platform-mac)
* [Windows](https://flight-manual.atom.io/hacking-atom/sections/hacking-on-atom-core/#platform-windows)

## Discussion

* Discuss Atom on [GitHub Discussions](https://github.com/atom/atom/discussions)

## License

[MIT](https://github.com/atom/atom/blob/master/LICENSE.md)

When using the Atom or other GitHub logos, be sure to follow the [GitHub logo guidelines](https://github.com/logos).
