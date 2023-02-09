const chrome = require('selenium-webdriver/chrome')
const { Builder, By, Key, until } = require('selenium-webdriver')
    // const { saveToDb } = require('sql')

const chromeOptios = new chrome.Options()
    // chromeOptios.addArguments('start-maximized');
    // chromeOptios.addArguments('--window-size=1850,4080')
chromeOptios.addArguments('--window-size=1600,2080')
    // chromeOptios.addArguments('--headless')
chromeOptios.setUserPreferences({
    profile: {
        default_content_settings: {
            images: 2,
        },
        managed_default_content_settings: {
            images: 2,
        },
    },
})

export const connect = () => {
    const page = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptios)
        .usingServer('http://localhost:4444/wd/hub/')
        .build()
    return page
}
export const exit = (page) => {
    try {
        page.quit()
        console.log('ok exit')
    } catch (error) {
        console.log('error exit', error)
    }
}

export const pageScrollToBottom = async(page, maxStep = 3) => {
    let h_repeat = 0
    let last_h = 0

    for (let u = 1; u <= maxStep; u++) {
        await page.executeScript(' window.scrollBy({ top: 50000 }); ')
            // console.log('прок ', u);

        await page.sleep(3 * 1000)
            // await creatScreenshot(page, './img/30-sd.png')

        let hh = await page.executeScript(' return document.body.scrollHeight ')
        if (last_h == hh) {
            h_repeat++

            if (h_repeat == 2) {
                return true
            }
        }

        last_h = hh
    }

    // console.log('222222');
    // await page.sleep(30000);
}

export const loadGoodsFromListCat = async(page, priceNormalizator) => {
    // ждём загрузки продуктов
    await page.wait(
        until.elementLocated(By.xpath('//div[@class="product"]')),
        10000,
    )

    const goods = await page.findElements(By.xpath('//div[@class="product"]'))

    let nn = 0
    let res = []

    for (let g of goods) {
        nn++
        // console.log('nn', nn)
        // console.log('nn g', g)

        let good = await SD_GoodMiniParser(g, priceNormalizator)
            // console.log('good', good);
        res.push(good)

        // console.log('good2', good)
        // good.cat = catUri
        // let res = await saveToDb(
        //     connection,
        //     'sd_good', [
        //         'name',
        //         'uri',
        //         // 'kod_str',
        //         'kod',
        //         'img',
        //         'cat',
        //         'price_str',
        //         'price',
        //         'price_dop',
        //         'created_at',
        //     ],
        //     good,
        // )
        // console.log('')
        // console.log('')
    }
    return res
}

/**
 * стройдвор / скан товара в из списка
 * @param {*} page
 * @param {*} uri
 */
export const SD_GoodMiniParser = async(driver, priceNormalizator) => {
    let res = {}

    try {
        let a1 = await driver.findElement(By.xpath('./a[@class="product-name"]'))

        res.name = await a1.getText()

        let link0 = await a1.getAttribute('href')
        res.uri = getCatLink(link0)

        try {
            let a1 = await driver.findElement(
                By.xpath('./div[@class="product-code"]/span'),
            )

            res.kod_str = await a1.getText()
            res.kod = priceNormalizator(res.kod_str)
        } catch (error) {
            console.log('parserGoodMini ошибка скана кода')
        }

        try {
            let a1 = await driver.findElement(
                By.xpath(
                    './div[@class="product-buy-section"]/sd-product-price/div[@class="price"]/span[@class="main"]',
                ),
            )
            res.price_str = await a1.getText()
            res.price = priceNormalizator(res.price_str)
                // res.price = priceNormalizator('123.44 sdsd')
        } catch (error) {
            console.log('parserGoodMini ошибка скана цены')
        }

        try {
            let a1 = await driver.findElement(
                By.xpath('./div[@class="product-buy-section"]/ui-unit-tab/button'),
            )
            res.price_dop = await a1.getText()
        } catch (error) {
            console.error('parserGoodMini ошибка скана допа к цене')
        }

        try {
            let a1 = await driver.findElement(
                By.xpath('./ui-product-list-image/a/cx-media/img'),
            )
            res.img = await a1.getAttribute('src')
                // let imgs0 = await a1.getAttribute('srcset')
                // res.imgs = imgs0.split(' ')
        } catch (error) {
            console.error('parserGoodMini ошибка скана картинки')
        }
        return res
    } catch (error) {
        console.log('-- parserGoodMini ошибка скана ссылки')
            // console.log(error)
    }
}

/**
 * парсинг характеристик товара из полного товара
 * @param {fn} driver
 * @param {fn} onlyNumber
 */
export const SD_GoodFullParserGetHarakteristik = async(
    driver,
    onlyNumber,
    connection,
    good_id = 0,
    saveToDb = true,
) => {
    let resHa = []

    try {
        let o = await xPathLoadWaites(
            driver,
            '//sd-product-attributes-view/ul/li',
            // '//sd-product-attributes-view/ul/li/text()',
            5,
        )

        try {
            for (let y of o) {
                try {
                    let textName2 = await y.getText()
                        // console.log('textName2', textName2);
                    let eew = textName2.split('\n')
                        // let eew = y.split('\n')
                        // console.log('eew', eew);

                    if (good_id > 0 && saveToDb == true) {
                        res = { good_id: good_id, pole: '', value: '' }
                        res.pole = shift(eew)
                        res.value = eew.join(' ')

                        console.log('   parse har-ka ', res)

                        // saveToDb = async(connection, table, polya, data) =
                        await saveToDb(
                            connection,
                            'sd_goods_options', ['good_id', 'pole', 'value'],
                            res,
                        )
                    }

                    resHa.push(eew)
                } catch (error) {
                    console.error(771)
                }
            }
        } catch (error) {
            console.error(77)
        }
    } catch (error) {
        console.error('   textName err ')
        console.log(error)
    }

    // console.log('res options ', resHa);
    return resHa
}

/**
 * парсинг где сколько у полного товара
 * @param {*} driver
 * @param {*} goodForParsing
 * @param {*} priceNormalizator
 */
export const SD_GoodFullParserGetOnSklad = async(
    driver,
    onlyNumber,
    connection,
    good_uri = '',
    saveToDb,
) => {
    let onShop = []
    try {
        let shops = await xPathLoadWaites(
            driver,
            '//div[@class="shoplist"]/div[@class="shop"]',
        )

        for (let s of shops) {
            try {
                let shop1 = {
                    'good_uri': good_uri,
                    address: '',
                    sheldule: '',
                    in_stock_str: '',
                    in_stock: 0,
                    ed_izm: '',
                }

                try {
                    let adress = await s.findElement(
                        By.xpath('./div/div[@class="shop-address"]'),
                    )
                    shop1.address = await adress.getText()
                } catch (error) {
                    console.error('ошибка получения адреса')
                }

                try {
                    let worktime = await s.findElement(
                        By.xpath('./div/div[@class="shop-worktime"]'),
                    )
                    shop1.sheldule = await worktime.getText()
                } catch (error) {
                    console.error('ошибка получения раб часы')
                }

                try {
                    let available = await s.findElement(
                        By.xpath('./div/div[@class="shop-available"]'),
                    )

                    shop1.in_stock_str = await available.getText()

                    if (shop1.in_stock_str.indexOf('Привезем') >= 0) {
                        console.log('  т.к. они что то привезут, значит в магазине нет')
                    } else {

                        let available2 = onlyNumber(shop1.in_stock_str)
                        shop1.in_stock = available2 > 0 ? available2 : 0
                        console.log('  не привезут, есть ', shop1.in_stock)

                        if (shop1.available > 0) {
                            let ed = shop1.in_stock_str.split(' ')
                            shop1.ed_izm = ed.pop()
                        }

                        // console.log('сохранить или нет ... ', good_uri, ' / ', saveToDb, shop1)

                        if (good_uri != '' && shop1.in_stock > 0) {
                            // console.log('   +++ ')
                            // saveToDb = async(connection, table, polya, data) =
                            await saveToDb(
                                connection,
                                'sd_goods_in_shop', ['good_uri', 'address', 'sheldule', 'in_stock_str', 'in_stock'],
                                shop1,
                            )
                        }
                        // else {
                        //     console.log('   --- ')
                        // }

                        // await driver.sleep(1 * 1000)



                    }
                } catch (error) {
                    console.error('ошибка получения на складе')
                    console.error(error)
                }

                // await driver.sleep(5 * 1000)

                onShop.push(shop1)
            } catch (error) {}
        }
    } catch (error) {
        console.error('-- SD_GoodFullParserGetOnSklad err')
        console.error(error)
    }
    return onShop
}

export const SD_GoodFullParser = async(
    driver,
    goodForParsing = {},
    priceNormalizator,
    onlyNumber,
    connection,
    saveToDb
) => {

    console.log('start SD_GoodFullParser ', goodForParsing);
    // await driver.sleep(2 * 1000)

    let check = await checkNowGood(driver, goodForParsing)

    if (!check) {
        console.log('загружена НЕ тот товар')
            // continue
        return false
    } else {
        console.log('загружена ТОТ товар')

        await driver.sleep(2 * 1000)
        await pageScrollToBottom(driver, 3)
        await driver.sleep(3 * 1000)

        let res = { options: [] }

        res.options = await SD_GoodFullParserGetHarakteristik(
            driver,
            onlyNumber,
            connection,
            goodForParsing.uri,
        )

        res.onSklad = await SD_GoodFullParserGetOnSklad(
            driver,
            onlyNumber,
            connection,
            goodForParsing.uri,
            saveToDb
        )
        res.good = await SD_GoodFullGoodParser(
            driver,
            priceNormalizator,
            onlyNumber,
        )

        try {
            console.log('++ SD_GoodFullParser res ', res)
            return res
        } catch (error) {
            console.log('-- parserGoodMini ошибка скана цены')
                // throw ('-- parserGoodMini ошибка скана цены')
                // console.log(error)
            return false
        }
    }
}

/**
 * парсринг дааных товараа со страницы полной товареы
 * @param {*} driver
 * @param {*} goodForParsing
 * @param {*} priceNormalizator
 * @param {*} onlyNumber
 * @returns
 */
export const SD_GoodFullGoodParser = async(
    driver,
    priceNormalizator,
    onlyNumber,
) => {
    let res = {
        kod: 0,
        price: [],
    }

    try {
        let code0 = await xPathLoadWait(
            driver,
            '//sd-product-intro/div/span[@class="code"]',
            5,
        )
        let code1 = await code0.getText()
        res.kod = await onlyNumber(code1)
    } catch (error) {}

    try {
        let opis0 = await xPathLoadWait(
            driver,
            // '//sd-spoiler/div[contains(@class, "content")]',
            '//div[@class="content with-gradient"]',
            5,
        )
        res.opis = await opis0.getText()
    } catch (error) {
        console.error('   err opis')
    }

    try {
        let price0 = await xPathLoadWait(
                driver,
                '//sd-available-price/sd-price/div/div/span',
                5,
            )
            // res.price0 = await driver.findElement(By.xpath('//sd-available-price/sd-price/div/div/span'))

        let price0price = await price0.getText()
        let priceIn = { price: 0, name: '' }
        priceIn.price = await priceNormalizator(price0price)
            // res.priceIn.push(await priceNormalizator(res.price0) + 70)
        let priceName = await driver.findElement(
            By.xpath('//sd-available/ui-unit-tab/button'),
        )
        priceIn.name = await priceName.getText()
        res.price.push(priceIn)
    } catch (error) {
        console.log('   SD_GoodFullGoodParser ошибка скана цены')
            // console.log(error)
    }

    return res
}

export const getCatLink = (link) => {
    let a1 = link.split('/').pop()
    try {
        let a2 = a1.split('?')
        return a2[0]
    } catch (error) {
        return a1
    }
}
export const loadPage = async(page, uri) => {
    try {
        // let uri2 = 'https://www.sdvor.com/tmn/category/osnastka-i-rashodnye-materialy-8003'
        console.log('uri', uri)
            // page = await page.get(uri2)
        await page.get(uri)
    } catch (error) {
        console.error(' loadPage / error exit')
        console.error(error)
    }
}

/**
 * переход по менбшка в нужный каталог
 * @param {*} page
 * @param {*} catsData
 * @param {*} goToCatLink
 * @returns
 */
export const SDGoToCatNavFast = async(page, goToCatLink) => {
    try {
        await SDclickToCatBurger(page)
        await page.sleep(3 * 1000)
        let xxpath =
            '//ui-categories-menu/ui-desktop-categories-menu/nav/div/ul[1]/li[1]/ui-custom-generic-link/a'

        page.executeScript(
            " document.evaluate('" +
            xxpath +
            "', document, null, XPathResult.ANY_TYPE, null).href = '" +
            goToCatLink +
            "' ",
            // " const headings = document.evaluate('" + xxpath + "', document, null, XPathResult.ANY_TYPE, null); " +
            // " let thisHeading = headings.iterateNext(); " +
            // // let alertText = "Level 2 headings in this document are:\n";
            // " while (thisHeading) { " +
            // // alertText += `${thisHeading.textContent}\n`;
            // // document.getElementById('aaa').href = 'http://google.com/'
            // // " thisHeading.href = 'http://google.com/' " +
            // " thisHeading.href = '" + goToCatLink + "' " +
            // "} "
        )
        await page.sleep(1 * 1000)
        let click22 = await page.findElement(By.xpath(xxpath))
        click22.click()
        await page.sleep(3 * 1000)
    } catch (error) {
        console.error('-- SDGoToCatNavFast err')
        console.error(error)
    }
}

/**
 * переход по менбшка в нужный каталог
 * @param {*} page
 * @param {*} catsData
 * @param {*} goToCatLink
 * @returns
 */
export const SDGoToCatNav = async(page, catsData, goToCatLink = '') => {
    // console.log('++ SDGoToCatNav ')
    // console.log('++ SDGoToCatNav ', catsData)
    // console.log('++ SDGoToCatNav ')

    if (goToCatLink.length == 0) {
        goToCatLink = catsData.l0
    }

    // console.log('   goToCatLink ', goToCatLink)

    await SDclickToCatBurger(page)

    try {
        let gogoE = [
            // { l: 'x', n: 'x' } // ,
            // 'level2': { l: 'x', n: 'x' },
            // 'level3': { l: 'x', n: 'x' },
            // 'level4': { l: 'x', n: 'x' }
        ]

        if (catsData.l3 && catsData.l3.length > 0) {
            gogoE.push({ l: catsData.l0, n: catsData.n0 })
            gogoE.push({ l: catsData.l1, n: catsData.n1 })
            gogoE.push({ l: catsData.l2, n: catsData.n2 })
            gogoE.push({ l: catsData.l3, n: catsData.n3 })
        } else if (catsData.l2 && catsData.l2.length > 0) {
            gogoE.push({ l: catsData.l0, n: catsData.n0 })
            gogoE.push({ l: catsData.l1, n: catsData.n1 })
            gogoE.push({ l: catsData.l2, n: catsData.n2 })
        } else if (catsData.l1 && catsData.l1.length > 0) {
            gogoE.push({ l: catsData.l0, n: catsData.n0 })
            gogoE.push({ l: catsData.l1, n: catsData.n1 })
        }

        // console.log('gogo', gogoE)
        // console.log('gogo1', gogoE[0])
        // let gogoLast = gogoE.pop()
        // console.log('gogoLast', gogoLast)

        // try {

        //     linkEnd = await gogoE.pop()
        //     console.log('linkEnd', linkEnd)

        // } catch (error) {
        //     console.log('err 776 ');
        //     console.log(error);
        // }

        let qwe = await SDGoToCat(page, gogoE, goToCatLink)
        console.log('SDGoToCat 6871 ', qwe)

        // try {

        //     let a1 = await page.findElement(
        //         By.xpath('//ui-desktop-categories-menu/nav/div/ul[1]/li[1]/ui-custom-generic-link/a')
        //     )
        //     await a1.click()

        // } catch (error) {
        //     console.log('err 447 ', error);
        // }

        await page.sleep(3 * 1000)

        // //здесь проверяем номер итерации, если она только началась, то вставляем так же кусок нашего блока с "удалением"
        // if (q == 0) {
        //     tr.appendChild(delete_row);
        // }
        console.log('++-- SDGoToCatNav')
        return true
    } catch (error) {
        console.error('-- SDGoToCatNav err')
        console.error(error)
    }
    console.log('++-- SDGoToCatNav')
    return false
}

/**
 * переход на каталог
 */
export const SDGoToCat = async(page, gogoE, goToCatLink, step = 1) => {
    // async function SDGoToCat(page, link, actions, goTo = '', step = 1) {

    // console.log('++ SDGoToCat start', gogoE, step)

    try {
        // if (step == 1) {
        // кликаем бургер открывается менюшка
        if (step == 1) await SDclickToCatBurger(page)
            // }

        let cats1 = await SDgetListCats(page, step)
            // console.log('cats1', cats1)
            // console.log('cats1', cats1.length)

        try {
            // перебор кат1
            // console.log('-')
            // console.log('-')
            // console.log('-')
            // console.log('перебор кат', step)

            if (cats1 == false) {
                // console.log('777 22222');
                console.error('')
                console.error('')
                console.error('')
                console.error('не получилось загрузить страницу')
                console.error('')
                console.error('')
                console.error('')
                throw 'не получилось загрузить страницу'
                    // continue
            }

            let rre = gogoE.pop()
            let goTo = rre.n
                // console.log('goTo', goTo)

            for (let aCatNow of cats1) {
                // catLinkNow = c1

                let r = await aCatNow.getText()
                    // console.log('text link 1 ', r)

                try {
                    let h = await aCatNow.getAttribute('html')
                    if (h.indexOf(goToCatLink) >= 0) {
                        aCatNow.click()
                        console.log('7755 return true;')
                        return true
                    }
                    // else {
                    //     console.log('7766 return false;')
                    //     return false
                    // }
                } catch (error) {}

                if (goTo.length > 0) {
                    if (goTo != r) {
                        // console.log('77-- быстрый проход, НЕ сработал, пропускаем ', goTo, r);
                        continue
                    } else {
                        // console.log('77++');
                        // console.log('77++');
                        // console.log('77++ быстрый проход, сработал ', goTo, '/', r);

                        // console.log('clickCloseUpModal')
                        await page.sleep(3 * 1000)
                        await creatScreenshot(page)

                        // console.log('gogo.len', gogo.length);

                        console.log('   gogoE.length', gogoE.length)

                        // нашли что искали, клик и ждём загрузку
                        if (gogoE.length == 0) {
                            // try {

                            //     hr = await catLinkNow.getAttribute('href')
                            //     // console.log('hr', hr);

                            // } catch (error) {
                            //     // console.error('77 ош ссылка');
                            // }

                            try {
                                await aCatNow.click()
                            } catch (error) {
                                console.error('-- 7737 ош клик')
                            }

                            await page.sleep(3 * 1000)
                            await creatScreenshot(page)

                            let newCat = await xPathLoadWait(
                                page,
                                '//sd-product-grid-header/sd-product-list-title/h1',
                                3,
                            )
                            let newCat0 = await newCat.getText()

                            if (newCat0.indexOf(goTo) >= 0) {
                                console.log('77 return true;')
                                return true
                            } else {
                                console.log('77 return false;')
                                return false
                            }
                        }
                        // ещё не дошли что искали .. ищем дальше
                        else {
                            let actions = page.actions({ async: true })
                            await actions.move({ origin: aCatNow }).perform()
                            await page.sleep(2 * 1000)

                            await creatScreenshot(page)
                            await page.sleep(3 * 1000)

                            // let linkEnd = gogoE.pop()
                            // console.log('linkEnd', linkEnd);
                            let step2 = step + 1

                            // let step3 = step + 2
                            // let nextMenuEst = await menuEnableCheck(page, step3)
                            // if (nextMenuEst) {
                            //     console.log('след меню есть');
                            // } else {
                            //     console.log('след меню НЕТ');
                            // }

                            // await SDGoToCat(page, gogoE, actions, linkEnd.n, step2)
                            await SDGoToCat(page, gogoE, goToCatLink, step2)
                        }
                    }

                    // console.log('вот и всё');
                    // await page.sleep(20 * 1000)

                    // if (1 == 1) {
                    //     try {
                    //         await actions.move({ origin: c1 }).perform()

                    //         await page.sleep(2 * 1000)

                    //         let cat = await xPathLoadWait(
                    //             page,
                    //             // '//ui-desktop-categories-menu/nav/div/ul[2]/li[1]'
                    //             '//ui-desktop-categories-menu/nav/div/ul[2]/li[1]/ui-custom-generic-link/a',
                    //         )

                    //         if (cat == false) {
                    //             console.log('- - - ')
                    //             console.log('- - - не дождались появления 2 меню')
                    //             console.log('- - - ')
                    //         }

                    //         // await cat1a.click()
                    //         // await page.sleep(3000)
                    //         // await creatScreenshot(page, './img/30-sd-sd2.png')
                    //         // await page.sleep(1000)

                    //         // перебор кат2
                    //         if (1 == 1) {
                    //             try {
                    //                 await creatScreenshot(page, './img/30-sd-sd2.png')

                    //                 let cats2 = await SDgetListCats(page, 2, actions)

                    //                 for (let c2 of cats2) {
                    //                     // let nowLink = await xPathLoadWait(
                    //                     //     c2,
                    //                     //     './ui-custom-generic-link/a',
                    //                     // )

                    //                     // let cat2a = await c2.findElement(
                    //                     //     By.xpath('./ui-custom-generic-link/a'),
                    //                     // )
                    //                     // let cat2aa = {}
                    //                     // cat2aa.text = await cat2a.getText()
                    //                     // cat2aa.link_full = await cat2a.getAttribute('href')
                    //                     // cat2aa.link = getCatLink(cat2aa.link_full)

                    //                     // console.log(' - - cat2aText', cat2aa)
                    //                     // console.log(' ')

                    //                     // let menuLink = await c2.getText()
                    //                     let ll = await c2.getAttribute('href')
                    //                     let menuLink = getCatLink(ll)

                    //                     // console.log('SDclickToCatBurger cat2 ', link, menuLink);

                    //                     if (menuLink == link) {
                    //                         // console.log('вот он!!!')
                    //                         c2.click()
                    //                             // c2.click()
                    //                         await page.sleep(1000)
                    //                         return true
                    //                     }

                    //                     // await cat1a.click()
                    //                 }
                    //             } catch (error) {
                    //                 console.log('err SDGoToCat 3 - SDgetListCats')
                    //                 console.log('err', error)
                    //             }
                    //         }
                    //     } catch (error) {
                    //         console.log('SDGoToCat 54 нет ссылки в менюшке')
                    //             // console.log('err', error);
                    //     }
                    // }
                }
            }

            // await page.sleep(1000)
        } catch (error) {
            console.log('err ---------- SDGoToCat 2 - SDgetListCats')
                // console.log('err', error)
        }

        // если сходится .. то кликаем и ждём загрузки
    } catch (error) {
        console.log('SDGoToCat: err 1 ')
        console.log('err', error)
    }
}

export const creatScreenshot = async(page, toImg = './img/11.png') => {
    try {
        await page.takeScreenshot().then(function(image, err) {
            require('fs').writeFile(toImg, image, 'base64', function(err) {
                if (err) console.log('img error', err)
            })
        })
        console.log('   screenshot good: ', toImg)
    } catch (error) {
        console.log('ошибка создания скрина')
    }
}

export const clickCloseUpModal = async(page) => {
    try {
        let butCloseCityConfirm = await page.findElement(
            By.xpath(
                '//ui-city-defined-dialog/div/div[2]/button[@class="btn-close"]',
            ),
        )
        await butCloseCityConfirm.click()
            // console.log('ok');
    } catch (error) {
        // console.log('err');
        // console.log(error);
    }
}

// поиск товара и переход в полное описание
export const searchAndGoGood = async(page, goodSearch, priceNormalizator) => {

    try {

        await page.sleep(500)
            // await page.sleep(3 * 1000)
        await creatScreenshot(page)
            // await page.sleep(3 * 1000)
        let pole = await page.findElement(
                By.xpath('//form[@class="search-form"]/div/input'),
            )
            // pole.click()

        try {


            pole.clear()
            await page.sleep(50)
            pole.sendKeys(goodSearch.name)
                // await page.sleep(150)
                // pole.send_keys(' ')
            await page.sleep(50)
            let but = await page.findElement(
                By.xpath('//form[@class="search-form"]/button[1]'),
            )
            but.click()

            await page.sleep(2 * 1000)
            await creatScreenshot(page)
            await page.sleep(3 * 1000)
            await pageScrollToBottom(page, 2)
            await page.sleep(500)

            try {
                let searchItems = await xPathLoadWaites(page, '//div[@class="product"]')

                for (let re of searchItems) {
                    let good1 = await SD_GoodMiniParser(re, priceNormalizator)

                    try {
                        console.log('good1')
                        console.log('good1', good1.name)
                        console.log('good1', good1.kod, ' / ', goodSearch.kod)
                            // console.log('good1', good1);

                        // let nameInPage = goodSearch.kod.replace('...','')
                        // if( nameInPage.indexOf() )

                        if (good1.kod == goodSearch.kod) {
                            await console.log('это он! товар найден')
                            let a1 = await re.findElement(
                                By.xpath('./a[@class="product-name"]'),
                            )
                            await a1.click()
                                // await page.sleep(3 * 1000)
                            break
                        }
                        // await page.sleep(2000)
                    } catch (error) {
                        console.error('ошибка перебора')
                    }
                }

                await page.sleep(500)
                await creatScreenshot(page)

            } catch (error) {
                console.error('-- err ошибка поиска результатов поиска');
                // let searchItems = []
                return false
            }

            // await page.sleep(5000)

            // await butCloseCityConfirm.click()
            // console.log('ok');

        } catch (error) {
            console.log('-- err searchAndGoGood ошибка ввода или клика по форме поиска')
                // console.log(error)
        }

    } catch (error) {
        console.log('-- err searchAndGoGood ошибка поиска формы поиска')
            // console.log(error)
    }
}

/**
 * клик по бургеру меню
 * @param {*} page
 */
export const SDclickToCatBurger = async(page) => {
    // async function SDclickToCatBurger(page) {
    try {
        let burger = await page.wait(
                until.elementLocated(
                    By.xpath('//button[@class="cx-hamburger is-active"]'),
                ),
                3000,
            )
            // await page.sleep(500)
            // await burger.click()
            // await creatScreenshot(page, './img/30-sd-sd2.png')

        // console.log('+ SDclickToCatBurger 1 бургер уже кликнут ')
        // return true
    } catch (error) {
        // console.log('- SDclickToCatBurger 11 бургер ещё НЕ кликнут ')

        try {
            let burger = await page.wait(
                until.elementLocated(
                    By.xpath(
                        '//ui-desktop-categories-menu/button[@class="cx-hamburger"]',
                    ),
                ),
                10000,
            )
            await burger.click()
                // console.log(' + SDclickToCatBurger 2 кликyли по бургеру меню')

            // await page.sleep(2000)
            // await creatScreenshot(page, './img/30-sd-sd2.png')

            // return true
        } catch (error) {
            console.log(' - SDclickToCatBurger 21 ошибка клика по бургеру меню')
            return false
        }
    }

    await creatScreenshot(page)

    // try {
    //     remenu = await xPathLoadWait(
    //         page,
    //         // '//ui-categories-menu/ui-desktop-categories-menu/nav/div/ul[1]/li[1]',
    //         '//ui-desktop-categories-menu/nav/div/ul[1]/li[1]/ui-custom-generic-link/a',
    //         3
    //     )

    //     if (remenu) {
    //         await page.sleep(200)
    //         await creatScreenshot(page)
    //         return true
    //     } else {
    //         console.error('SDGoToCatNav не дождались загрузки меню')
    //         return false
    //     }
    // } catch (error) {
    //     console.error('SDGoToCatNav не дождались загрузки меню')
    //     return false
    // }
}

/**
 * проверяем загружен каталог с именем или нет
 * @param {*} page
 * @param {*} catName
 */
export const checkNowCat = async(page, catName) => {
    // console.log('** checkNowCat ', catName);
    try {
        let blockUpH1 = await xPathLoadWait(
            page,
            '//sd-product-grid-header/sd-product-list-title/h1',
            2,
        )
        let blockUpName = await blockUpH1.getText()
        if (blockUpName.indexOf(catName) > -1) {
            // console.log('++ проверка загрузки нужного каталога пройдена')
            return true
        }
        // else {
        //     console.error(
        //         '-- проверка загрузки нужного каталога НЕ пройдена ',
        //         blockUpName,
        //         catNow.name,
        //     )
        // }
    } catch (error) {
        // console.error('-- err checkNowCat');
        // console.error(error);
        // return false
    }

    return false
}

/**
 * проверяем загруженный товар тот или нет ( название + код )
 * @param {*} page
 * @param {*} good
 * @returns
 */
export const checkNowGood = async(page, goodCheck) => {
    // console.log('** checkNowCat ', catName);
    try {
        let blockUpH1 = await xPathLoadWait(
            page,
            '//cx-page-layout/cx-page-slot[1]/sd-product-intro/h1',
            // '//sd-product-grid-header/sd-product-list-title/h1',
            2,
        )
        let blockUpName = await blockUpH1.getText()
        if (blockUpName.indexOf(goodCheck.name) > -1) {
            let block2 = await xPathLoadWait(
                page,
                '//cx-page-layout/cx-page-slot[1]/sd-product-intro/div/span',
                2,
            )
            let blockKod = await block2.getText()
            if (blockKod.indexOf(goodCheck.kod) > -1) {
                return true
            }

            // console.log('++ проверка загрузки нужного каталога пройдена')
            return true
        }
        // else {
        //     console.error(
        //         '-- проверка загрузки нужного каталога НЕ пройдена ',
        //         blockUpName,
        //         catNow.name,
        //     )
        // }
    } catch (error) {
        // console.error('-- err checkNowCat');
        // console.error(error);
        // return false
    }

    return false
}

export const xPathLoadWait = async(page, xxpath, sec = 10) => {
    // async function xPathLoadWait(page, xxpath, sec = 10) {
    try {
        await page.wait(until.elementLocated(By.xpath(xxpath)), sec * 1000)
        let items = await page.findElement(By.xpath(xxpath))
        return items
            // return cat
    } catch (error) {
        console.log('err xPathLoadWait ', xxpath)
        return false
    }
}

export const xPathLoadWaites = async(page, xxpath, sec = 10) => {
    // async function xPathLoadWait(page, xxpath, sec = 10) {
    try {
        await page.wait(until.elementLocated(By.xpath(xxpath)), sec * 1000)
        let items = await page.findElements(By.xpath(xxpath))
        return items
            // return cat
    } catch (error) {
        console.log('err xPathLoadWaites ', xxpath)
        return false
    }
}

export const UpModalCityClose = async(page) => {
    try {
        close_ip_msg = await page.wait(
            until.elementLocated(
                By.xpath(
                    '//ui-city-defined-dialog/div/div[2]/button[@class="btn-close"]',
                ),
            ),
            5 * 1000,
        )
        await close_ip_msg.click()
        console.log('ОК закрытия верх плашки', 'clickCloseUpModal')
    } catch (error) {
        console.log('ошибка закрытия верх плашки', 'clickCloseUpModal')
    }
}

/**
 * получаем список ссылок в каталоге выпадающего меню
 * @param {*} page
 * @param {*} level
 * @returns
 */
export const SDgetListCats = async(page, level) => {
    // async function SDgetListCats(page, level) {
    console.log('++ SDgetListCats start ', level)

    try {
        await page.wait(
                until.elementLocated(
                    By.xpath('//ui-desktop-categories-menu/nav/div/ul[' + level + ']'),
                ),
                3 * 1000,
            )
            // let items = await page.findElements(By.xpath('//ui-desktop-categories-menu/nav/div/ul[' + level + ']'))
        let items = await page.findElements(
            By.xpath(
                '//ui-categories-menu/ui-desktop-categories-menu/nav/div/ul[' +
                level +
                ']/li',
            ),
        )
        return items
    } catch (error) {
        console.log('-- SDgetListCats err')
        console.log(error)
        return false
    }
}