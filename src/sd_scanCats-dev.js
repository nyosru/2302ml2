// require('./sd2.js')

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

const { priceNormalizator } = require('./inin/math')

async function start() {
    var page = driverConnect()

    try {
        // const connection = await mysqlConnect('46.254.19.97', 'parser1', 'parser', '123Parser')
        // const connection = await mysqlConnect('46.254.19.97', 'parser1', 'parser', '123Parser')
        const connection = await mysqlConnect()
            // connect = async(database, host, login, pass)
    } catch (error) {
        console.error('ошибка подключения к mysql')
        console.error(error)
    }

    try {
        for (let i = 1; i <= 50; i++) {
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

start()