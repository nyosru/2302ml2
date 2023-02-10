'use strict'

const telegas = async(msg) => {
    const uri =
        'https://api.uralweb.info/telegram.php?s=1&token=6272013314:AAE87uoGgRkLaKnFMuW2zkUqlAeJ_e9YyUg&domain=parser.php-cat.com&msg=' +
        msg

    const res = await fetch(uri)
        //         if (res.ok) {
        //             // const data = await res.json();
        //             // console.log(data);
        //         }
}

async function start() {
    //     try {
    await telegas('привет конфет')
}

start()