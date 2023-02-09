const mysql = require('mysql2/promise')

export const connect = async() => {
    const connection = await mysql.createConnection({
        // connectionLimit: 5,

        host: 'localhost',
        // host: 'ss_db',
        // host: 'aa.s1.php-cat.com',

        // 'localhost',
        // '127.0.0.1',
        // 'parser1',
        // 'root',
        // '123456',

        // host: host,
        database: 'parser1',
        user: 'root',
        password: '123456',

    })
    return connection
}
export const exit = (connection) => {
    try {
        connection.end()
        console.log('Подключение mysql закрыто')
    } catch (error) {
        console.log('Ошибка: ' + error)
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

export const creatScreenshot = async(page, toImg) => {
    try {
        page.takeScreenshot().then(function(image, err) {
            require('fs').writeFile(toImg, image, 'base64', function(err) {
                console.log('img error', err)
            })
        })
        console.log('screenshot good: ', toImg)
    } catch (error) {
        console.log('ошибка создания скрина')
    }
}

/**
 * запрос в базу данных
 * @param {*} connection соединение с бд
 * @param {*} sql сам запрос строкой
 * @param {*} da массив переменных где в запросе ?
 * @param {Integer} type 1 = только результат и 2 = результат + поля
 * @returns [result, rows]
 */
export const sql = async(connection, sql, da, type = 1) => {

    try {
        // const [err, fields, result, rows] = await connection.execute(sql, da)
        const [rows, fields] = await connection.execute(sql, da)
            // const sql0 = await connection.execute(sql, da)

        if (type == 2) {
            return { rows: rows, fields: fields }
        } else {
            return rows
        }
    } catch (error) {
        console.log('sql error: ', error)
        return false
    }


}

export const SD_GetCatForScan = async(connection) => {
    // получаем список каталогов для скана
    let catScan = await sql(
            connection,
            'SELECT ' +
            ' s.link l0, s.name n0, ' +
            ' s1.link l1, s1.name n1, ' +
            ' s2.link l2, s2.name n2, ' +
            ' s3.link l3, s3.name n3 ' +
            ' FROM `sd_cat` s ' +
            ' LEFT JOIN sd_cat s1 ON s1.link = s.catup_uri ' +
            ' LEFT JOIN sd_cat s2 ON s2.link = s1.catup_uri ' +
            ' LEFT JOIN sd_cat s3 ON s3.link = s2.catup_uri ' +
            ' WHERE s.type <= ? AND s.scan_start IS NULL LIMIT ? ', [4, 50],
        )
        // console.log('catScan', catScan)
    for (let c of catScan) {
        console.log('1');
        let catScan2 = await sql(
                connection,
                'UPDATE `sd_cat` SET `scan_start` = NOW() WHERE `sd_cat`.`link` = ?; ',
                //'SELECT `link`,`name` FROM `sd_cat` WHERE `type` = ? AND `scan_start` IS NULL LIMIT 1'
                [c.l0],
            )
            // console.log('catScan2', catScan2)
        let res2 = true
        try {
            // catScan22 = Array.prototype.slice.call(catScan[0])
            // console.log('catScan22', catScan22);
            res2 = true
            let arra = Object.values(c)
                // console.log('arra', arra);
            for (let gg of arra) {
                // console.log('gg', gg);
                if (gg == 'Новое в ассортименте' || gg == ' Сезонные товары ') {
                    res2 = false
                        // console.log('++00 новый проход не прокатил, этот каталог пропускаем')
                        // continue
                }
            }
            if (res2 == false) {
                //     // console.log(' ================ пропускаем ================== ');
                continue
            } else {
                return c
            }
        } catch (err) {
            console.error('sql -- SD_GetCatForScan err')
            console.error(err)
            throw ('sql -- SD_GetCatForScan err ' + err)
        }

    }
}

export const SD_getGoodForParse = async(connection) => {
    // получаем список каталогов для скана
    let goodsScan = await sql(
            connection,
            'SELECT ' +
            ' g.* ' +
            // 's.link l0, s.name n0, ' +
            // ' s1.link l1, s1.name n1, ' +
            // ' s2.link l2, s2.name n2, ' +
            // ' s3.link l3, s3.name n3 ' +
            ' FROM `sd_good` g ' +
            // ' LEFT JOIN sd_cat s1 ON s1.link = s.catup_uri ' +
            // ' LEFT JOIN sd_cat s2 ON s2.link = s1.catup_uri ' +
            // ' LEFT JOIN sd_cat s3 ON s3.link = s2.catup_uri ' +
            ' WHERE ' +
            ' g.start_update IS NULL ' +
            'OR ' +
            ' g.start_update - INTERVAL 2 DAY > NOW() ' +
            // '>= ? AND s.scan_start IS NULL '+
            'LIMIT ? ', [1],
        )
        // console.log('catScan', catScan)
    for (let g of goodsScan) {
        // console.log('1');
        let catScan2 = await sql(
            connection,
            'UPDATE `sd_good` SET `start_update` = NOW() WHERE `uri` = ?; ',
            //'SELECT `link`,`name` FROM `sd_cat` WHERE `type` = ? AND `scan_start` IS NULL LIMIT 1'
            [g.uri],
        )

        return g
            //     // console.log('catScan2', catScan2)
            // let res2 = true
            // try {
            //     // catScan22 = Array.prototype.slice.call(catScan[0])
            //     // console.log('catScan22', catScan22);
            //     res2 = true
            //     let arra = Object.values(c)
            //         // console.log('arra', arra);
            //     for (let gg of arra) {
            //         // console.log('gg', gg);
            //         if (gg == 'Новое в ассортименте' || gg == ' Сезонные товары ') {
            //             res2 = false
            //                 // console.log('++00 новый проход не прокатил, этот каталог пропускаем')
            //                 // continue
            //         }
            //     }
            //     if (res2 == false) {
            //         //     // console.log(' ================ пропускаем ================== ');
            //         continue
            //     } else {
            //         return c
            //     }
            // } catch (err) {
            //     console.error('sql -- SD_GetCatForScan err')
            //     console.error(err)
            //     throw ('sql -- SD_GetCatForScan err ' + err)
            // }

    }
}


// async function saveToDb(connection, table, polya, data) {
export const saveToDb = async(connection, table, polya, data) => {

    // let new_id = ''

    try {
        let sql1 = ''
        let sql2 = ''
        let datain = []

        // console.log('polya', polya)
        // console.log('data', data)

        for (let k of Object.values(polya)) {
            // console.log('k', k)

            if (k == 'created_at' || k == 'updated_at' || k == 'deleted_at') {
                sql1 += (sql1.length > 0 ? ', ' : '') + k
                sql2 += (sql2.length > 0 ? ', ' : '') + ' NOW() '
            } else if (Object.prototype.hasOwnProperty.call(data, k)) {
                sql1 += (sql1.length > 0 ? ', ' : '') + k
                sql2 += (sql2.length > 0 ? ', ' : '') + ' ? '
                datain.push(data[k])
                    // console.log('ключ есть', k)
            }
            //  else {
            //     console.log('ключа нет', k)
            // }
        }

        // добавление объекта
        const sql =
            'INSERT INTO ' + table + ' ( ' + sql1 + ' ) VALUES( ' + sql2 + ' ) '
            // console.log('sql', sql)

        const [results] = await connection.execute(sql, datain)
            // console.log('re', results);
            // console.log('insertId', results.insertId)
            // console.log('insertId', results)
        return results
    } catch (err) {
        if (err.toString().indexOf('plicate entry') >= 0) {
            console.log('db insert: уже есть')
        } else {
            console.log('ошибка в запросе на добавление ', err)
            console.log(err)
        }
        return false
    }
    // return new_id
}