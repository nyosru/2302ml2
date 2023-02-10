'use strict'

// try {
//     const {
//         connect: mysqlConnect,
//         exit: mysqlExit,
//         SD_GetCatForScan,
//         saveToDb,
//         //
//     } = require('./inin/sql')
// } catch (error) {
//     console.log('big6 err', error)
// }

// // базовые функции драйвера
// try {
//     const {
//         connect: driverConnect,
//         exit: driverExit,
//         loadPage,
//         creatScreenshot,
//         // скрол вниз
//         pageScrollToBottom,
//         clickCloseUpModal,
//     } = require('./inin/driver')
// } catch (error) {
//     console.log('big5 err', error)
// }

// // драйвер, работа с SD
// try {
//     const {
//         // закрыть плашку подтверждения города
//         UpModalCityClose,
//         // получаем список товаров на странице, парсим, сохраняем в базу
//         loadGoodsFromListCat,
//         // вытащить из ссылки uri каталога
//         getCatLink,
//         // проверка загруженного каталога по имениы
//         checkNowCat,
//         // ждём загрузки элемента и его возращаем
//         xPathLoadWait,
//         // переход по меню в каталог
//         SDGoToCatNav,
//         SDGoToCatNavFast,
//     } = require('./inin/driver')
// } catch (error) {
//     console.log('big4 err', error)
// }

// // скан товаров
// try {
//     const {
//         // выборка что парсить
//         SD_getGoodForParse,
//     } = require('./inin/sql')
// } catch (error) {
//     console.log('big3 err', error)
// }

// try {
//     const {
//         searchAndGoGood,
//         checkNowGood,
//         SD_GoodFullParser,
//     } = require('./inin/driver')
// } catch (error) {
//     console.log('big2 err', error)
// }

// try {
//     const { priceNormalizator, onlyNumber } = require('./inin/math')
// } catch (error) {
//     console.log('big err', error)
// }

const telegas = async(msg) => {
    try {
        const uri =
            'https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=parser.php-cat.com&msg=' +
            msg // http://www.mysite.ru/index.php

        const res = await fetch(uri)
        if (res.ok) {
            // const data = await res.json();
            // console.log(data);
        }
    } catch (error) {
        console.error(error)
    }
}




// const express = require('express'),
//     app = express(),
//     request = require('request')

// const host = '127.0.0.1'
// const port = 7000

// // app.get('/', (req, res) => {

// let msg = 'Привет водопровод'
// let url =
//     'https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=parser.php-cat.com&msg=' + msg

// request(
//         // 'http://example.com/api',
//         url,
//         (err, response, body) => {
//             if (err) return res.status(500).send({ message: err })
//             return res.send(body)
//         }
//     )
//     // })

// // app.listen(port, host, () =>
// //   console.log(`Server listens http://${host}:${port}`)
// // )




// const https = require('https');
// // let url = 'https://script.google.com/macros/s/AKfycbwxPZTx1yOVGmVADtbvHScQqplz49knom4t_fCTHliQx9oaN4I/exec?p=123&p_1=11&p_2=22&p_3=33&p_4=44&p_5=55';


// function doRequest(msg) {


//     let url =
//         'https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=parser.php-cat.com&msg=' + msg

//     https.get(url, (res) => {
//         if (res.statusCode >= 300 && res.statusCode <= 400 && res.headers.location) {
//             doRequest(res.headers.location);
//         }
//         res.on('data', (d) => {
//             process.stdout.write(d);
//         });

//     }).on('error', (e) => {
//         console.error(e);
//     });
// }

// doRequest('тест манифест');






async function start() {
    //     try {
    await telegas('привет конфет')
        //     } catch (error) {
        //         console.log('telega1 err ', error)
        //     }
        //     try {
        //         var page = driverConnect()
        //     } catch (error) {
        //         console.log('var page = driverConnect() err', error)
        //     }

    //     try {
    //         const connection = await mysqlConnect('parser1', 'root', '123456')

    //         // await loadPage(telega, 'https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=parser.php-cat.com&msg=парсинг 1: старт')
    //         telegas('парсинг 1: старт')

    //         try {
    //             let step = 0
    //                 // for (let i = 1; i <= 300; i++) {
    //             for (let i = 1; i <= 500; i++) {
    //                 step++
    //                 // если всегда загружать страницу заново а не кликать по поиску и товарам
    //                 // step = 1

    //                 // скан товаров с поиском
    //                 let good = await SD_getGoodForParse(connection)

    //                 // good.uri = 'geotekstil-netkanyj-dornit-150-gm2-2h50-m-80892'
    //                 // good.name = 'Геотекстиль нетканый Дорнит 150 г/м2 2х50 м'
    //                 // good.kod = 80892

    //                 // console.log('goodForParse', good);

    //                 console.log('')
    //                 console.log('')
    //                 console.log('good uri ', good.uri)
    //                 console.log('good name ', good.name)
    //                 console.log('good kod ', good.kod)

    //                 // первый проход
    //                 if (step == 1) {
    //                     console.log('')
    //                     console.log('загрузка страницы')
    //                     await loadPage(page, 'https://www.sdvor.com/tmn/product/' + good.uri)
    //                     await page.sleep(500)
    //                     await clickCloseUpModal(page)
    //                     await page.sleep(500)
    //                     await creatScreenshot(page)
    //                 }

    //                 // второй проход и далее
    //                 else {
    //                     console.log('')
    //                     console.log('ищем и переходим по результату поиска')
    //                     goodSearch = await searchAndGoGood(page, good, priceNormalizator)

    //                     if (goodSearch == false) {
    //                         console.log(
    //                                 '   - - - не перешли в найденный товар, не нашли, идём на след товар',
    //                             )
    //                             // await page.sleep(5 * 1000)
    //                         continue
    //                     }
    //                     // else {
    //                     //     console.log('   перешли OK в найденный товар');
    //                     //     await page.sleep(3 * 1000)
    //                     // }
    //                 }

    //                 // await page.sleep(2 * 1000)

    //                 let goodParse = await SD_GoodFullParser(
    //                     page,
    //                     good,
    //                     priceNormalizator,
    //                     onlyNumber,
    //                     connection,
    //                     saveToDb,
    //                 )

    //                 if (goodParse == false) {
    //                     console.error('ошибка парсинга биг товара')
    //                 } else {
    //                     // console.log('goodParse')
    //                     // console.log('goodParse')
    //                     // console.log('goodParse', goodParse)
    //                 }

    //                 // await page.sleep(5 * 1000)
    //                 // console.log('идём с ледуюющему товару');

    //                 // await loadPage(telega, 'https://api.uralweb.info/telegram.php?s=1&domain=parser.php-cat.com&msg=ок + ' + good.name)
    //                 // await loadPage(telega, 'https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=parser.php-cat.com&msg=ok ' + good.name)
    //                 telegas('ok ' + good.name)
    //             }
    //         } catch (error) {
    //             console.error('after SD_GetCatForScan', error)
    //         }

    //         console.log('')
    //         console.log('')
    //         await mysqlExit(connection)
    //         await driverExit(page)
    //         await driverExit(page3)
    //         console.log('')
    //         console.log('')
    //     } catch (error) {
    //         // ошибка подклчения к бд
    //         // await loadPage(telega, 'https://api.uralweb.info/telegram.php?s=1&domain=aa.s1.php-cat.com&msg=парсинг 1: ошибка конекта к БД')
    //         // await loadPage(telega, 'https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=aa.s1.php-cat.com&msg=парсинг 1: ошибка конекта к БД')
    //         telegas('парсинг 1: ошибка конекта к БД')
    //     }
}

// // loadPage(telega, 'https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=parser.php-cat.com&msg=01 pars: старт')
// // telegas('01 pars: старт')

start()