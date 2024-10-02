# Проект: "Приложение погоды"

## Введение

Учебный проект по Vue. 

Ссылка на видеоматериал: <a href="https://www.youtube.com/watch?v=NilffTjcDVA&list=PL4cUxeGkcC9hfoy8vFQ5tbXO3vY0xhhUZ&index=6">Youtube</a>

Ссылка на оригинальный репозиторий: <a href="https://github.com/johnkomarnicki/net_ninja_vue_3_weather_app">Github</a>


## Описание проекта 

Стек: Vue, Tailwindcss, axios.
Написано с подходом Composition API

Приложение позволяет посмотреть погоду по локации. 

При вводе населенного пункта в input делается API запрос к geocode.maps.co 
Оттуда получаем координаты (latitude и longitude), которые впоследствии используем для отправки api запросов к timeapi.io (получение времени) и api.open-meteo.com (получение погоды). Полученные данные взаимодействуют между собой и актуальные данные о погоде на сутки, основываясь на местном времени


## Замечание

Для корректной работы приложения нужно получить api-ключ для geocode.maps.co
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
Hello UserName,

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

```
npm run dev
```




