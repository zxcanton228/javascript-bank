# KIROVE BANK — Vanilla JavaScript

Одностраничное банковское приложение (SPA), написанное **полностью с нуля на чистом JavaScript**: без React, без Vue, без jQuery, без axios. Из зависимостей — только сборщик (Webpack), транспайлер (Babel), препроцессор (Sass), линтер (ESLint) и форматтер (Prettier). Всё остальное — собственные микро-библиотеки и сервисы.

Проект — это, по сути, самописный мини-фреймворк: свой DOM-слой (`KQuery`), свой HTTP-слой (`kiroveQuery`), свой роутер, свой стор с реактивностью на `Proxy`, своя система компонентов с шаблонами и CSS-модулями.

**Материалы:** https://htmllessons.io

---

## Оглавление

- [Функциональность](#функциональность)
- [Технологический стек](#технологический-стек)
- [Быстрый старт](#быстрый-старт)
- [Структура проекта](#структура-проекта)
- [Архитектура](#архитектура)
  - [Точка входа и жизненный цикл](#точка-входа-и-жизненный-цикл)
  - [Слой ядра (core)](#слой-ядра-core)
  - [KQuery — собственный DOM-слой](#kquery--собственный-dom-слой)
  - [kiroveQuery — собственный HTTP-слой](#kiroveQuery--собственный-http-слой)
  - [Router — клиентская маршрутизация](#router--клиентская-маршрутизация)
  - [Store — состояние на Proxy](#store--состояние-на-proxy)
  - [RenderService — шаблоны и подстановка компонентов](#renderservice--шаблоны-и-подстановка-компонентов)
  - [Компонентная модель](#компонентная-модель)
  - [API-слой](#api-слой)
  - [Событийная шина](#событийная-шина)
- [Паттерны проектирования](#паттерны-проектирования)
- [Стилизация](#стилизация)
- [Кодстайл и соглашения](#кодстайл-и-соглашения)
- [Сборка](#сборка)
- [Переменные окружения](#переменные-окружения)
- [Известные ограничения и точки роста](#известные-ограничения-и-точки-роста)
- [Контакты](#контакты)

---

## Функциональность

| Возможность | Описание |
|---|---|
| Аутентификация | Единая форма login / register с переключением типа на лету, JWT в `localStorage` |
| Карта | Просмотр номера / срока / CVC / баланса, копирование номера в буфер, скрытие-показ CVC |
| Баланс | Пополнение (`top-up`) и снятие (`withdrawal`) |
| Переводы | Перевод по номеру карты с автоформатированием `xxxx-xxxx-xxxx-xxxx` |
| Контакты | Список пользователей, клик подставляет номер карты в поле перевода |
| Поиск | Живой поиск пользователей в шапке с `debounce` 300 мс |
| Транзакции | Лента последних операций (сортировка `desc`) |
| Статистика | Доход / расход + самописная SVG donut-диаграмма |
| Уведомления | Тосты `success` / `error` с авто-скрытием через 3 с |
| Роутинг | `/`, `/about-us`, `/auth` + 404, без перезагрузки страницы |

---

## Технологический стек

**Runtime:** чистый ES2021+ (классы, приватные поля `#`, `Proxy`, `async/await`, опциональная цепочка).

**Тулинг:**
- Webpack 5 (`webpack-dev-server`, `html-webpack-plugin`, `mini-css-extract-plugin`, `clean-webpack-plugin`, `terser-webpack-plugin`, `css-minimizer-webpack-plugin`, `DefinePlugin`)
- Babel (`@babel/preset-env`)
- Sass + CSS Modules
- ESLint (`eslint:recommended`) + Prettier (`@trivago/prettier-plugin-sort-imports`)
- dotenv

**Требования:** Node `>= 22.2.0`, Yarn `>= 1.22.19` или npm `>= 10.8.0`.

---

## Быстрый старт

```bash
yarn install

# создать .env в корне (см. раздел «Переменные окружения»)

yarn dev     # webpack serve --mode development --open
yarn build   # webpack --mode production → /dist
```

Приложению нужен работающий REST-бэкенд по адресу `SERVER_URL` с префиксом `/api`.

---

## Структура проекта

```
src/
├── api/                     # сервисы обращения к бэкенду
│   ├── auth.service.js
│   ├── card.service.js
│   ├── statistic.service.js
│   ├── transaction.service.js
│   └── user.service.js
│
├── components/
│   ├── layout/              # каркас: header, notification, layout
│   │   └── header/          # logo, search, logout-button
│   ├── screens/             # экраны-страницы (роуты)
│   │   ├── auth/
│   │   ├── home/            # card-info, actions, contacts,
│   │   │                    # transactions, statistics
│   │   ├── about-us/
│   │   └── not-found/
│   └── ui/                  # переиспользуемые примитивы
│       ├── button/  field/  heading/  loader/
│       ├── user-item/  donut-chart/
│       └── auth-required-message/
│
├── config/                  # colors, seo, url
├── constants/               # auth.constants, event.constants
│
├── core/                    # «фреймворк»
│   ├── component/           # BaseScreen, ChildComponent
│   ├── kquery/              # KQuery — DOM-обёртка
│   ├── kirove-query/        # kiroveQuery — HTTP-обёртка
│   ├── router/              # Router + routes.data
│   ├── services/            # render, form, storage, notification, validation
│   └── store/               # Store (Singleton + Observer + Proxy)
│
├── styles/                  # _variables, _mixins, _reset, _keyframes, global
├── utils/                   # debounce, format/*
├── index.html
└── index.js                 # точка входа: new Router()
```

Дополнительно: `.fttemplates/component/` — шаблоны File Templates (VS Code / WebStorm) для генерации тройки `*.component.js` + `*.module.scss` + `*.template.html` одной командой. Это фиксирует единообразие структуры компонентов на уровне инструментов.

---

## Архитектура

Приложение построено по слоистой схеме с однонаправленным потоком данных:

```
index.js
   │
   └── Router ──── Layout ──── Header ──── Search / Logo / LogoutButton / UserItem
        │            │
        │            └── Notification + #content
        │
        └── Screen (Home / Auth / AboutUs / NotFound)
                 │
                 ├── ChildComponent'ы (CardInfo, Actions, Contacts, …)
                 │        │
                 │        └── api/*.service ──► kiroveQuery ──► fetch
                 │
                 └── Store (Singleton, Proxy) ──► notify() ──► observer.update()
```

Ключевая идея: **ни одна строка кода не пишет в DOM напрямую через `document.querySelector` в компонентах** — всё идёт через `$K()`; ни один компонент не вызывает `fetch` — всё идёт через `api/*.service` → `kiroveQuery`.

### Точка входа и жизненный цикл

`src/index.js` предельно лаконичен:

```js
import { Router } from '@/core/router/router'
import './styles/global.scss'

new Router()
```

Роутер — единственный «корневой» объект. Он сам определяет текущий маршрут, инстанцирует экран, оборачивает его в `Layout` и монтирует в `#app`.

### Слой ядра (core)

`core/` — это и есть мини-фреймворк. Он не знает ничего о банке, картах и транзакциях: это универсальные примитивы, которые можно вынести в отдельный пакет.

| Модуль | Роль |
|---|---|
| `component/base-screen.component.js` | Абстрактный класс экрана. В конструкторе выставляет `document.title` через `seo.config`, `render()` бросает ошибку — контракт для наследников |
| `component/child.component.js` | Абстрактный класс дочернего компонента с тем же контрактом `render()` |
| `kquery/` | DOM-обёртка с fluent-интерфейсом |
| `kirove-query/` | HTTP-клиент + `extractErrorMessage` |
| `router/` | History API роутер |
| `store/` | Глобальное состояние |
| `services/render.service.js` | HTML-строка → `HTMLElement` + подстановка компонентов + CSS-модули |
| `services/form.service.js` | Сбор значений формы в объект |
| `services/storage.service.js` | Типобезопасная обёртка над `localStorage` с JSON-сериализацией |
| `services/notification.service.js` | Показ тостов |
| `services/validation.service.js` | Подсветка невалидных полей с авто-сбросом |

### KQuery — собственный DOM-слой

`core/kquery/kquery.lib.js` — jQuery-подобная библиотека на ~330 строк. Экспортируется как функция-фабрика `$K(selector)`, возвращающая новый экземпляр класса `KQuery`. Принимает либо CSS-селектор, либо готовый `HTMLElement`, иначе бросает исключение.

Все мутирующие методы возвращают `this` — **fluent interface / method chaining**:

```js
$K(this.element)
    .find('#card-number')
    .text(formatCardNumber(this.card.number))
    .click(this.#copyCardNumber.bind(this))
```

Группы API:

- **События:** `on(type, cb)`, `click(cb)`
- **Формы:** `submit(cb)` (сам делает `preventDefault`), `input({ onInput, ...attrs })`, `value(newValue?)`
- **Специализированные инпуты:** `numberInput(limit)` — фильтрует всё, кроме цифр; `creditCardInput()` — фильтрует и на лету форматирует номер карты дефисами
- **Поиск:** `find(selector)`, `findAll(selector)` (возвращает массив `KQuery`, а не `NodeList`)
- **Вставка:** `append`, `before`, `html(content?)`, `text(content?)`
- **Стили:** `css(prop, value)`, `show()`, `hide()`
- **Классы и атрибуты:** `addClass`, `removeClass` (принимают строку или массив), `attr(name, value?)`, `removeAttr`

Геттер и сеттер совмещены в одном методе (`text()` читает, `text('x')` пишет) — как в jQuery. Методы агрессивно валидируют вход и бросают понятные ошибки (`Element must be a form`, `Element must be an input with type "number"`).

### kiroveQuery — собственный HTTP-слой

`core/kirove-query/kirove-query.lib.js` — обёртка над `fetch`, вдохновлённая React Query (отсюда и название). Одна асинхронная функция, принимающая объект-конфиг:

```js
const { isLoading, error, data } = await kiroveQuery({
    path: '/cards/balance/top-up',
    method: 'PATCH',
    body: { amount: 100 },
    onSuccess: data => { /* … */ },
    onError: message => { /* … */ }
})
```

Что она берёт на себя:

1. Склеивает URL: `${SERVER_URL}/api${path}`
2. Достаёт `accessToken` из `StorageService` и подставляет заголовок `Authorization: Bearer …`
3. Ставит `Content-Type: application/json`, сериализует `body`
4. Разбирает ответ, при ошибке нормализует сообщение через `extractErrorMessage` (умеет и строку, и массив сообщений — как отдаёт NestJS-валидация)
5. **Сама показывает тост с ошибкой** — компонентам не нужно обрабатывать неудачи вручную
6. Возвращает унифицированный кортеж `{ isLoading, error, data }`

### Router — клиентская маршрутизация

`core/router/router.js` использует History API и приватные поля класса (`#routes`, `#currentRoute`, `#layout`).

- Перехватывает **все** клики по `<a>` через делегирование на `document` (`event.target.closest('a')`), гасит переход и вызывает `navigate()`
- Слушает `popstate` для кнопок «назад/вперёд»
- Ищет маршрут в декларативной таблице `routes.data.js`; если не нашёл — рендерит `NotFound`
- **Оптимизация layout'а:** `Layout` со `Header` создаётся один раз, при последующих переходах перерисовывается только содержимое `#content`. Шапка не мигает при навигации

Маршруты вынесены в отдельный файл-данные:

```js
export const ROUTES = [
    { path: '/',          component: Home },
    { path: '/about-us',  component: AboutUs },
    { path: '/auth',      component: Auth }
]
```

На стороне dev-сервера включён `historyApiFallback: true`, чтобы прямой заход на `/auth` не давал 404.

### Store — состояние на Proxy

`core/store/store.js` совмещает три паттерна сразу.

**Singleton** — единственный экземпляр через статический метод:

```js
static getInstance() {
    if (!Store.instance) Store.instance = new Store({ user: null })
    return Store.instance
}
```

**Реактивность через `Proxy`** — любая запись в `state` автоматически дёргает `notify()`:

```js
this.state = new Proxy(state, {
    set: (target, property, value) => {
        target[property] = value
        this.notify()
        return true
    }
})
```

**Observer** — компоненты подписываются через `addObserver(this)` и обязаны реализовать метод `update()`. При изменении состояния `notify()` вызывает `update()` у всех подписчиков. Так `Header` показывает/прячет блок авторизованного пользователя, а `Home` подменяет содержимое на «требуется вход» — без всякого ручного проброса пропсов.

Стор гидрируется из `localStorage` при создании: если пользователь уже сохранён, начальное состояние берётся из хранилища, а не из аргумента конструктора. Методы `login()`, `logout()`, `updateCard()` синхронно обновляют и состояние, и хранилище.

### RenderService — шаблоны и подстановка компонентов

`core/services/render.service.js` — сердце рендеринга. Экспортируется **готовым инстансом** (`export default new RenderService()`), то есть работает как синглтон-модуль.

Метод `htmlToElement(html, components, styles)` делает три вещи:

**1. Парсит HTML-строку в реальный DOM** через `DOMParser`. HTML-шаблоны лежат в отдельных `.template.html` файлах и подключаются как модули благодаря `html-loader`:

```js
import template from './card-info.template.html'
```

Разметка полностью отделена от логики — никаких многострочных шаблонных литералов в JS.

**2. Подставляет компоненты по кастомным тегам.** В шаблоне пишется декларативная разметка:

```html
<div class="home">
    <div>
        <component-card-info></component-card-info>
        <component-transactions></component-transactions>
    </div>
    <div>
        <component-statistics></component-statistics>
        <component-actions></component-actions>
        <component-contacts></component-contacts>
    </div>
</div>
```

Приватный метод `#replaceComponentTags` находит все теги по префиксу `component-`, приводит `card-info` → `cardinfo`, ищет соответствие среди переданных компонентов по `constructor.name.toLowerCase()` и заменяет тег на результат `render()`. Это самодельная альтернатива Web Components / JSX.

Умеет принимать и **класс** (`Actions`), и **готовый инстанс** (`new Heading('Statistics')`) — первое для компонентов без параметров, второе когда нужно передать аргументы:

```js
this.element = renderService.htmlToElement(
    template,
    [new Heading('Statistics')],
    styles
)
```

**3. Применяет CSS-модули.** `#applyModuleStyles` обходит элемент и всех потомков и заменяет «человеческие» имена классов из шаблона на хешированные имена из объекта стилей. Благодаря этому в `.template.html` можно писать `class="card"`, а в бандл попадёт `card_a1b2c3d`.

### Компонентная модель

Каждый компонент — это папка из трёх файлов:

```
button/
├── button.component.js     # логика
├── button.module.scss      # изолированные стили
└── button.template.html    # разметка
```

Два базовых класса задают контракт:

- `BaseScreen` — для экранов-роутов; конструктор принимает `{ title }` и выставляет `document.title`
- `ChildComponent` — для всего остального

Оба объявляют `render()`, бросающий `Error('Render method must be implemented in the child class')` — эмуляция абстрактного метода в языке без `abstract`.

Типичный компонент:

```js
export class Button extends ChildComponent {
    constructor({ children, onClick, variant }) {
        super()
        if (!children) throw new Error('Children is empty')
        this.children = children
        this.onClick = onClick
        this.variant = variant
    }

    render() {
        this.element = renderService.htmlToElement(template, [], styles)
        $K(this.element).html(this.children).click(this.onClick)
        if (this.variant) $K(this.element).addClass(styles[this.variant])
        return this.element
    }
}
```

Соглашения, которые соблюдаются по всему проекту:

- Конструктор принимает **объект-пропсы** с деструктуризацией и значениями по умолчанию (`{ placeholder, type = 'text', value = '', name, variant }`)
- Обязательные пропсы валидируются в конструкторе и бросают исключение — fail fast (`Field` без `name`, `UserItem` без `avatarPath`)
- `render()` всегда возвращает `HTMLElement` и сохраняет ссылку в `this.element`
- Вариативность оформления делается через проп `variant`, который мапится в класс CSS-модуля: `styles[this.variant]` → `green` / `purple` / `credit-card`
- Приватные обработчики — через `#` и **стрелочные поля класса**, чтобы `this` не терялся: `#handleSearch = async event => { … }`
- Компоненты с подписками на глобальные события реализуют `destroy()` для отписки

Про `destroy()`: экран `Home` держит реестр «долгоживущих» дочерних компонентов и при повторном рендере корректно их пересоздаёт:

```js
createOrUpdateComponent(component, componentName) {
    if (this.components[componentName]) {
        this.components[componentName].destroy()
    }
    this.components[componentName] = new component()
    return this.components[componentName]
}
```

Это ручная имитация lifecycle-хуков (`componentWillUnmount`) — защита от утечек слушателей при навигации.

**Загрузка данных** унифицирована: компонент рендерит `Loader`, через `setTimeout(…, 500)` дёргает `fetchData()`, а по ответу удаляет лоадер по `LOADER_SELECTOR` и заполняет разметку. Селектор лоадера экспортируется из самого компонента — рядом с тем, кто за него отвечает:

```js
export const LOADER_SELECTOR = '[data-component="loader"]'
```

Тот же приём с `TRANSFER_FIELD_SELECTOR` в `transfer-field.component.js` — так `Search` из шапки может подставить номер карты в поле перевода на главной, не завися от структуры чужого шаблона.

### API-слой

Каждый ресурс бэкенда — отдельный класс-сервис с приватным полем базового пути:

```js
export class CardService {
    #BASE_URL = '/cards'

    byUser(onSuccess) {
        return kiroveQuery({ path: `${this.#BASE_URL}/by-user`, onSuccess })
    }
}
```

| Сервис | Методы | Эндпоинты |
|---|---|---|
| `AuthService` | `main(type, body)` | `POST /auth/login`, `POST /auth/register` |
| `CardService` | `byUser`, `updateBalance`, `transfer` | `/cards/by-user`, `PATCH /cards/balance/:type`, `PATCH /cards/transfer-money` |
| `UserService` | `getAll(searchTerm)` | `GET /users?searchTerm=` |
| `TransactionService` | `getAll` | `GET /transactions?orderBy=desc` |
| `StatisticService` | `main` | `GET /statistics` |

Сервисы, меняющие состояние, инкапсулируют и побочные эффекты: `AuthService.main` при успехе сам вызывает `store.login()` и показывает уведомление; `CardService.transfer` сам подставляет номер карты отправителя из стора и рапортует об успехе. Компонент остаётся тонким.

Query-строки собираются через `URLSearchParams` — без ручной конкатенации.

### Событийная шина

Для связи компонентов, которые не находятся в отношении «родитель — потомок», используются **нативные DOM-события на `document`** как легковесная шина:

```js
// constants/event.constants.js
export const BALANCE_UPDATED = 'balanceUpdated'
export const TRANSACTION_COMPLETED = 'transactionCompleted'
```

`Actions` после пополнения баланса диспатчит `BALANCE_UPDATED`, `TransferField` после перевода — оба события сразу. `CardInfo` слушает `BALANCE_UPDATED` и перезапрашивает карту; `Transactions` и `Statistics` слушают `TRANSACTION_COMPLETED` и обновляют себя. Имена событий вынесены в константы, чтобы исключить опечатки.

Разделение ответственности между Store и шиной осмысленное: **Store** держит долгоживущее состояние (пользователь, карта), **шина** передаёт разовые сигналы «данные протухли, перезапроси».

---

## Паттерны проектирования

| Паттерн | Где | Зачем |
|---|---|---|
| **Singleton** | `Store.getInstance()`, модули-инстансы `renderService`, `formService`, `validationService` | Одна точка правды для состояния и общих утилит |
| **Observer / Pub-Sub** | `Store.addObserver / notify`, компоненты с `update()` | Реактивность без ручного проброса данных |
| **Proxy / реактивный прокси** | `new Proxy(state, { set })` | Автоматический вызов `notify()` при любом присваивании |
| **Facade** | `KQuery` над DOM API, `kiroveQuery` над `fetch`, `StorageService` над `localStorage` | Простой унифицированный интерфейс поверх низкоуровневых API |
| **Fluent Interface / Chaining** | Все мутаторы `KQuery` возвращают `this` | Читаемые цепочки вместо промежуточных переменных |
| **Template Method** | `BaseScreen` / `ChildComponent` с абстрактным `render()` | Единый контракт для всех компонентов |
| **Composite** | Дерево компонентов, где `render()` возвращает `HTMLElement` | Однородная сборка UI из вложенных частей |
| **Factory** | `$K()` — функция-фабрика над `new KQuery()`, `createOrUpdateComponent()` | Скрывает `new`, даёт короткий вызов |
| **Service Layer** | `api/*.service.js`, `core/services/*` | Изоляция сетевого доступа и побочных эффектов от UI |
| **Strategy (через variant)** | `Button`, `Field` — проп `variant` выбирает класс/поведение | Одна реализация вместо клонов компонента |
| **Event Bus (Mediator)** | `document` + `event.constants.js` | Общение компонентов вне иерархии |
| **Event Delegation** | Перехват кликов по `<a>` на уровне `document` | Один слушатель на все ссылки, включая будущие |
| **Module Pattern** | ES-модули + приватные поля `#` | Настоящая инкапсуляция, а не соглашение об `_` |

---

## Стилизация

- **Sass** с разбиением на партиалы: `_variables.scss` (дизайн-токены), `_reset.scss`, `_mixins.scss`, `_keyframes.scss`, `global.scss`
- **CSS Modules** (`*.module.scss`) для всех компонентов. В webpack настроен `localIdentName: '[local]_[hash:base64:7]'`, а маппинг применяется рантаймом в `RenderService.#applyModuleStyles`
- Два регэкспа в конфиге webpack разводят модульные и глобальные `.scss`: `/\.module\.s[ac]ss$/i` против `/^((?!\.module).)*s[ac]ss$/i`
- Тёмная тема, дизайн-токены:

  ```scss
  $font: 'Rubik', sans-serif;
  $primary: #917cff;   $secondary: #08f0c8;
  $bg-block: #0f1112;  $gray: #181a1e;
  $text-gray: #4f5157; $white: #fdfdfd;
  $radius: 0.7rem;     $gap: 30px;
  ```

- Анимации через глобальные классы (`fade-in`, `bounce`, `rotate`) и `@keyframes` — назначаются из JS в нужный момент. В `Search` элементы появляются каскадом через `transition-delay: ${index * 0.1}s`
- Цвета, нужные в JS-логике, вынесены в `config/colors.config.js` (например, цвет ошибочной рамки), чтобы не хардкодить их в коде

**Donut-диаграмма** нарисована вручную: `DonutChart` генерирует SVG через `createElementNS`, переводит полярные координаты в декартовы (`#polarToCartesian`), считает проценты сегментов и собирает `path` с дугами (`A ... largeArcFlag`). Никакого Chart.js.

---

## Кодстайл и соглашения

**Prettier** (`.prettierrc`):

```jsonc
{
  "useTabs": true,       // табы
  "tabWidth": 2,
  "semi": false,         // без точек с запятой
  "singleQuote": true,   // одинарные кавычки
  "arrowParens": "avoid",// x => x, а не (x) => x
  "trailingComma": "none"
}
```

**Автосортировка импортов** (`@trivago/prettier-plugin-sort-imports`) с явно заданным порядком и разделением групп пустой строкой:

```
третьи стороны → @/core → @/components → @/styles → @/config
→ @/utils → @/api → *.template.html / *.module.scss → ../ → ./
```

Именно поэтому во всех файлах импорты выглядят одинаково — это не ручная дисциплина, а плагин.

**Соглашения об именовании файлов:**

| Шаблон | Назначение |
|---|---|
| `*.component.js` | Компонент |
| `*.template.html` | Разметка компонента |
| `*.module.scss` | Изолированные стили компонента |
| `*.service.js` | Сервис (API или инфраструктурный) |
| `*.config.js` | Конфигурация |
| `*.constants.js` | Константы |
| `*.util.js` | Утилита |
| `*.lib.js` | Самописная библиотека |
| `*.data.js` | Декларативные данные (таблица роутов) |

**Прочее:**

- **Алиас `@/`** → `src/`, настроен синхронно в трёх местах: `webpack.config.js` (`resolve.alias`), `jsconfig.json` (`paths`) и `.eslintrc.json` (`import/resolver`). Относительных путей вида `../../../` в проекте практически нет
- **JSDoc** на всех публичных методах ядра — с `@param`, `@returns` и union-типами (`{('GET'|'POST'|'PATCH'|'DELETE'|'PUT')}`). Это даёт автодополнение и подсказки в IDE без перехода на TypeScript
- **Приватность** — через настоящие приватные поля и методы `#`, а не префикс `_`
- **Fail fast** — конструкторы и методы валидируют аргументы и бросают исключения с внятным текстом
- **Магические строки вынесены в константы**: ключи хранилища (`auth.constants.js`), имена событий (`event.constants.js`), селекторы (`LOADER_SELECTOR`, `TRANSFER_FIELD_SELECTOR`)
- **ESLint** на базе `eslint:recommended`; стилевые правила выключены, чтобы не конфликтовать с Prettier
- **Язык:** код и JSDoc — на английском, отдельные поясняющие комментарии — на русском

---

## Сборка

`webpack.config.js` c `context: src/` и единой точкой входа `./index.js`.

**Режимы.** Всё поведение ветвится по `isDev = process.env.NODE_ENV === 'development'`:

| | dev | production |
|---|---|---|
| Имена файлов | `[name].js` | `[name].[contenthash].js` |
| CSS | `style-loader` (инжект в `<head>`) | `MiniCssExtractPlugin` (отдельный файл) |
| Source maps | `source-map` | выключены |
| Минификация | нет | Terser + CssMinimizer, комментарии вырезаются |
| HTML | как есть | схлопывание пробелов, удаление комментариев |

**Лоадеры:** `babel-loader` (JS), `html-loader` (шаблоны как модули), `sass-loader` + `css-loader` + `style-loader`/`MiniCssExtractPlugin` (стили), `asset/resource` для изображений.

**Плагины:** `CleanWebpackPlugin` (очистка `dist`), `HtmlWebpackPlugin` (генерация `index.html`), `MiniCssExtractPlugin`, `DefinePlugin` (проброс `process.env` в клиентский код).

**Dev-сервер:** порт из `.env`, `hot: true`, `historyApiFallback: true` для SPA-роутинга.

---

## Переменные окружения

Создайте `.env` в корне проекта:

```env
NODE_ENV="production"
PORT=7777
SERVER_URL="http://localhost:4200"
```

- `NODE_ENV` — управляет режимом сборки и всеми ветвлениями в `webpack.config.js`
- `PORT` — порт `webpack-dev-server`
- `SERVER_URL` — база REST API; читается в `config/url.config.js` и попадает в бандл через `DefinePlugin`

> Переменные встраиваются в клиентский бандл на этапе сборки — секреты сюда класть нельзя.

---

## Известные ограничения и точки роста

Честный список того, что стоит доработать:

- `Statistics.#removeListeners()` вызывает `removeEventListener` с `.bind(this)`, создавая новую функцию — отписка не срабатывает. В `Transactions` и `CardInfo` та же задача решена правильно, через стрелочное поле класса
- В `notification.service.js` в объекте `classNames` опечатка в ключе (`erros` вместо `error`) — стилизация тоста ошибки не применяется
- `NotificationService.#setTimeout` вызывает `clearTimeout()` без аргумента
- В `kiroveQuery` переменная `error` объявлена, но никогда не заполняется — всегда возвращается `null`
- `Transactions.fetchData` проверяет `data.length`, а итерирует `data.transactions` — форма ответа проверяется не по тому полю
- `KQuery.find()` создаёт инстанс до проверки на `null`, поэтому ветка с ошибкой недостижима: падение произойдёт раньше, в конструкторе
- Сумма перевода запрашивается через `prompt()` — стоит заменить на модальное окно
- Экраны `AboutUs` и `NotFound` возвращают строку, а не `HTMLElement`, — расходится с контрактом остальных компонентов
- Нет тестов и CI

---

## Контакты

**Кирилл Вегеле**

- Email: [kirove.work@gmail.com](mailto:kirove.work@gmail.com)
- Telegram: [@kerrove](https://t.me/kerrove)
- Репозиторий: https://github.com/zxcanton228/javascript-bank

Соавтор: Max [RED GROUP]
