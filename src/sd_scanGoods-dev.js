// require('./sd2.js')

import axios from 'axios';
// const { aaa, aaa2 } = require('./inin')

const {
    connect: mysqlConnect,
    exit: mysqlExit,
    SD_GetCatForScan,
    saveToDb,
    //
} = require('./inin/sql')
    // базовые функции драйвера
const {
    connect: driverConnect,
    exit: driverExit,
    loadPage,
    creatScreenshot,
    // скрол вниз
    pageScrollToBottom,
    clickCloseUpModal,
} = require('./inin/driver')
    // драйвер, работа с SD
const {
    // закрыть плашку подтверждения города
    UpModalCityClose,
    // получаем список товаров на странице, парсим, сохраняем в базу
    loadGoodsFromListCat,
    // вытащить из ссылки uri каталога
    getCatLink,
    // проверка загруженного каталога по имениы
    checkNowCat,
    // ждём загрузки элемента и его возращаем
    xPathLoadWait,
    // переход по меню в каталог
    SDGoToCatNav,
    SDGoToCatNavFast,
} = require('./inin/driver')

// скан товаров
const {
    // выборка что парсить
    SD_getGoodForParse,
} = require('./inin/sql')
const {
    searchAndGoGood,
    checkNowGood,
    SD_GoodFullParser,
} = require('./inin/driver')

const { priceNormalizator, onlyNumber } = require('./inin/math')

// Want to use async/await? Add the `async` keyword to your outer function/method.
const telegas = async(msg) => {
    try {
        const response = await axios.get('https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=parser.php-cat.com&msg=' + msg);
        //   await loadPage(telega, 'https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=parser.php-cat.com&msg=парсинг 1: старт')
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

telegas('привет конфет')

async function start() {

    var page = driverConnect()

    try {
        const connection = await mysqlConnect('parser1', 'root', '123456')

        // await loadPage(telega, 'https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=parser.php-cat.com&msg=парсинг 1: старт')
        telegas('парсинг 1: старт')

        try {
            let step = 0
                // for (let i = 1; i <= 300; i++) {
            for (let i = 1; i <= 30; i++) {

                step++
                // если всегда загружать страницу заново а не кликать по поиску и товарам
                // step = 1

                // скан товаров с поиском
                let good = await SD_getGoodForParse(connection)

                // good.uri = 'geotekstil-netkanyj-dornit-150-gm2-2h50-m-80892'
                // good.name = 'Геотекстиль нетканый Дорнит 150 г/м2 2х50 м'
                // good.kod = 80892

                // console.log('goodForParse', good);

                console.log('')
                console.log('')
                console.log('good uri ', good.uri)
                console.log('good name ', good.name)
                console.log('good kod ', good.kod)

                // первый проход
                if (step == 1) {
                    console.log('')
                    console.log('загрузка страницы')
                    await loadPage(page, 'https://www.sdvor.com/tmn/product/' + good.uri)
                    await page.sleep(500)
                    await clickCloseUpModal(page)
                    await page.sleep(500)
                    await creatScreenshot(page)
                }

                // второй проход и далее
                else {
                    console.log('')
                    console.log('ищем и переходим по результату поиска')
                    goodSearch = await searchAndGoGood(page, good, priceNormalizator)

                    if (goodSearch == false) {
                        console.log('   - - - не перешли в найденный товар, не нашли, идём на след товар');
                        // await page.sleep(5 * 1000)
                        continue
                    }
                    // else {
                    //     console.log('   перешли OK в найденный товар');
                    //     await page.sleep(3 * 1000)
                    // }
                }

                // await page.sleep(2 * 1000)

                let goodParse = await SD_GoodFullParser(page, good, priceNormalizator, onlyNumber, connection, saveToDb)

                if (goodParse == false) {
                    console.error('ошибка парсинга биг товара')
                } else {
                    // console.log('goodParse')
                    // console.log('goodParse')
                    // console.log('goodParse', goodParse)
                }

                // await page.sleep(5 * 1000)
                // console.log('идём с ледуюющему товару');

                // await loadPage(telega, 'https://api.uralweb.info/telegram.php?s=1&domain=parser.php-cat.com&msg=ок + ' + good.name)
                // await loadPage(telega, 'https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=parser.php-cat.com&msg=ok ' + good.name)
                telegas('ok ' + good.name)

                continue

                // скан каталогов
                let catParce = await SD_GetCatForScan(connection)

                if (catParce === undefined) {
                    console.error('НЕТ НИЧЕГО')
                    continue
                }
                // console.log('catParce', catParce)

                let catUri = catParce.l0
                let catName = catParce.n0

                console.log('')
                console.log('парсим каталог ', catUri)
                    // console.log('ii', i);
                if (i == 1) {
                    console.log('загрузка страницы')
                    await loadPage(page, 'https://www.sdvor.com/tmn/category/' + catUri)
                    await page.sleep(500)
                    await clickCloseUpModal(page)
                        // await page.sleep(2 * 1000)
                        // await clickCloseUpModal(page)
                } else {
                    console.log('переход по меню ')
                        // await SDGoToCatNav(page, catParce, catUri)
                        // await clickCloseUpModal(page)
                    await SDGoToCatNav(page, catParce, catUri)
                        // console.log('gogo ', 'https://www.sdvor.com/tmn/category/' + catUri)
                        // await SDGoToCatNavFast(page, 'https://www.sdvor.com/tmn/category/' + catUri)
                }

                await page.sleep(1 * 1000)
                await creatScreenshot(page)
                await page.sleep(5 * 1000)

                check = await checkNowCat(page, catName)

                console.log('')
                console.log(catName)

                if (check) {
                    console.error('++ загруженный каталог соответствует нужному')
                    console.error('++ загруженный каталог соответствует нужному')
                    console.error('++ загруженный каталог соответствует нужному')
                } else {
                    console.error('-- загруженный каталог не соответствует нужному')
                    console.error('-- загруженный каталог не соответствует нужному')
                    console.error('-- загруженный каталог не соответствует нужному')
                    console.error('идём на след заход')
                    continue
                }

                await pageScrollToBottom(page, 3)
                await creatScreenshot(page)

                goods = await loadGoodsFromListCat(page, priceNormalizator)
                    // console.log('goods', goods)

                for (let good of goods) {
                    // console.log('good', good)
                    console.log('   good / ', good.name)
                    good.cat = catUri

                    let res = await saveToDb(
                        connection,
                        'sd_good', [
                            'name',
                            'uri',
                            // 'kod_str',
                            'kod',
                            'img',
                            'cat',
                            'price_str',
                            'price',
                            'price_dop',
                            'created_at',
                        ],
                        good,
                    )
                }

                continue

                await UpModalCityClose(page)
                await page.sleep(3 * 1000)
                await creatScreenshot(page, './img/11.png')

                await pageScrollToBottom(page, 3)
                await creatScreenshot(page, './img/11.png')

                goods = await loadGoodsFromListCat(page, priceNormalizator)
                console.log('goods', goods)

                for (let good of goods) {
                    console.log('good', good)
                    good.cat = catUri

                    let res = await saveToDb(
                        connection,
                        'sd_good', [
                            'name',
                            'uri',
                            // 'kod_str',
                            'kod',
                            'img',
                            'cat',
                            'price_str',
                            'price',
                            'price_dop',
                            'created_at',
                        ],
                        good,
                    )
                }
            }
        } catch (error) {
            console.error('after SD_GetCatForScan', error)
        }

        console.log('')
        console.log('')
        await mysqlExit(connection)
        await driverExit(page)
        console.log('')
        console.log('')


    }
    // ошибка подклчения к бд
    catch (error) {
        // await loadPage(telega, 'https://api.uralweb.info/telegram.php?s=1&domain=aa.s1.php-cat.com&msg=парсинг 1: ошибка конекта к БД')
        // await loadPage(telega, 'https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=aa.s1.php-cat.com&msg=парсинг 1: ошибка конекта к БД')
        telegas('парсинг 1: ошибка конекта к БД')

    }

}

// loadPage(telega, 'https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=parser.php-cat.com&msg=01 pars: старт')
telegas('01 pars: старт')

// start()