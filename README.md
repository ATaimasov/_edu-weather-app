# Проект: "Приложение погоды"

## Введение

Учебный проект по Vue. 
Изначально создавался по гайду (<a href="https://www.youtube.com/watch?v=NilffTjcDVA&list=PL4cUxeGkcC9hfoy8vFQ5tbXO3vY0xhhUZ&index=6">Youtube</a>, <a href="https://github.com/johnkomarnicki/net_ninja_vue_3_weather_app">Github</a>), впоследствии из-за нестабильности сервера, отправляющего данные на api-запросы (указанного в гайде), решил реализовать часть приложения по-своему.

## Отсебятина

В противовес гайду с ютуба реализовано следующее:
<br> 
1. Вместо использованного в видеоматериале API-сервера, запрос погодных данных осуществляется на другой сервер. 
Соответственно, работа происходит с другими данными (например, это привело к необходимости п.2).
<br>
2. Использована независящая от API-сервера библиотека иконок (<a href="https://github.com/erikflowers/weather-icons">Github</a>)
<br>
3. Было проанализировано иное погодное приложение, также делающее API-запрос к open-meteo.com, но написанное на Svelte (<a href="https://github.com/cakePhone/SkyMuse">Github</a>).
Оттуда частично слизана реализация работы с получаемыми данными, но в тоже время скорректированная под мой проект (open source, он такой).
<br> 
4. Встроен <a href="https://swiperjs.com/">Swiper</a> для положительного UX
<br>

---

## Описание проекта 

Стек: 
- Vue
- Vue Router
- <a href="https://tailwindcss.com/">Tailwind CSS</a> 
- <a href="https://swiperjs.com/">Swiper</a>
- <a href="https://axios-http.com/ru/">Axios</a> 
- font-css библиотека иконок: <a href="https://github.com/erikflowers/weather-icons">Weather Icons</a> 

Написано с подходом Composition API

Приложение позволяет посмотреть погоду по локации. 

При вводе населенного пункта в input делается API запрос к geocode.maps.co 
Оттуда получаем координаты (latitude и longitude), которые впоследствии используем для отправки api запроса к open-meteo.com
Данные, полученные от open-meteo.com, переносятся в объекты с которыми происходит взаимодействие шаблона. 

Так, мы получаем актуальную погоду по геолокации на 24 часа. Иконки и описания выводятся в соответствии с состоянием погоды.

## Замечание

Для корректной работы приложения нужно получить api-ключ geocode.maps.co
Он бесплатный.

Остальные ресурсы ключ не требуют, но могут использовать свои ограничения по IP-адресу


## Установка и запуск проекта

```
git clone https://github.com/ATaimasov/_edu-weather-app.git
```

```
npm install
```

<br>

---

**Получаем бесплатный API-ключ**
1.  регистрируемся на https://geocode.maps.co/
2.  получаем ключ по почте. Вы должны получить сообщение следующего содержания:

```
Hello *UserName*,

You have successfully created a new geocoding API key. The details are below:

API KEY: ******

Limit: 1 Request/Second
```


3. создаем файл .env в корневой папке проекта

4. вставляем туда ключ следующим образом: 

```
VITE_GEOCODE_API_KEY=*API-KEY*
```

5. готово!

---

<br>

Запускаем проект🚀

```
npm run dev
```




