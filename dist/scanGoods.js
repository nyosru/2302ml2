(()=>{var e={203:(e,t,o)=>{"use strict";o.r(t),o.d(t,{SDGoToCat:()=>k,SDGoToCatNav:()=>S,SDGoToCatNavFast:()=>x,SD_GoodFullGoodParser:()=>m,SD_GoodFullParser:()=>y,SD_GoodFullParserGetHarakteristik:()=>h,SD_GoodFullParserGetOnSklad:()=>w,SD_GoodMiniParser:()=>g,SDclickToCatBurger:()=>b,SDgetListCats:()=>L,UpModalCityClose:()=>O,checkNowCat:()=>E,checkNowGood:()=>C,clickCloseUpModal:()=>T,connect:()=>n,creatScreenshot:()=>v,exit:()=>d,getCatLink:()=>f,loadGoodsFromListCat:()=>p,loadPage:()=>_,pageScrollToBottom:()=>u,searchAndGoGood:()=>G,xPathLoadWait:()=>D,xPathLoadWaites:()=>N});const a=require("selenium-webdriver/chrome"),{Builder:r,By:l,Key:s,until:c}=require("selenium-webdriver"),i=new a.Options;i.addArguments("--window-size=1600,2080"),i.setUserPreferences({profile:{default_content_settings:{images:2},managed_default_content_settings:{images:2}}});const n=()=>(new r).forBrowser("chrome").setChromeOptions(i).usingServer("http://localhost:4444/wd/hub/").build(),d=e=>{try{e.quit(),console.log("ok exit")}catch(e){console.log("error exit",e)}},u=async(e,t=3)=>{let o=0,a=0;for(let r=1;r<=t;r++){await e.executeScript(" window.scrollBy({ top: 50000 }); "),await e.sleep(3e3);let t=await e.executeScript(" return document.body.scrollHeight ");if(a==t&&(o++,2==o))return!0;a=t}},p=async(e,t)=>{await e.wait(c.elementLocated(l.xpath('//div[@class="product"]')),1e4);const o=await e.findElements(l.xpath('//div[@class="product"]'));let a=[];for(let e of o){let o=await g(e,t);a.push(o)}return a},g=async(e,t)=>{let o={};try{let a=await e.findElement(l.xpath('./a[@class="product-name"]'));o.name=await a.getText();let r=await a.getAttribute("href");o.uri=f(r);try{let a=await e.findElement(l.xpath('./div[@class="product-code"]/span'));o.kod_str=await a.getText(),o.kod=t(o.kod_str)}catch(e){console.log("parserGoodMini ошибка скана кода")}try{let a=await e.findElement(l.xpath('./div[@class="product-buy-section"]/sd-product-price/div[@class="price"]/span[@class="main"]'));o.price_str=await a.getText(),o.price=t(o.price_str)}catch(e){console.log("parserGoodMini ошибка скана цены")}try{let t=await e.findElement(l.xpath('./div[@class="product-buy-section"]/ui-unit-tab/button'));o.price_dop=await t.getText()}catch(e){console.error("parserGoodMini ошибка скана допа к цене")}try{let t=await e.findElement(l.xpath("./ui-product-list-image/a/cx-media/img"));o.img=await t.getAttribute("src")}catch(e){console.error("parserGoodMini ошибка скана картинки")}return o}catch(e){console.log("-- parserGoodMini ошибка скана ссылки")}},h=async(e,t,o,a=0,r=!0)=>{let l=[];try{let t=await N(e,"//sd-product-attributes-view/ul/li",5);try{for(let e of t)try{let t=(await e.getText()).split("\n");a>0&&1==r&&(res={good_id:a,pole:"",value:""},res.pole=shift(t),res.value=t.join(" "),console.log("   parse har-ka ",res),await r(o,"sd_goods_options",["good_id","pole","value"],res)),l.push(t)}catch(e){console.error(771)}}catch(e){console.error(77)}}catch(e){console.error("   textName err "),console.log(e)}return l},w=async(e,t,o,a="",r)=>{let s=[];try{let c=await N(e,'//div[@class="shoplist"]/div[@class="shop"]');for(let e of c)try{let c={good_uri:a,address:"",sheldule:"",in_stock_str:"",in_stock:0,ed_izm:""};try{let t=await e.findElement(l.xpath('./div/div[@class="shop-address"]'));c.address=await t.getText()}catch(e){console.error("ошибка получения адреса")}try{let t=await e.findElement(l.xpath('./div/div[@class="shop-worktime"]'));c.sheldule=await t.getText()}catch(e){console.error("ошибка получения раб часы")}try{let s=await e.findElement(l.xpath('./div/div[@class="shop-available"]'));if(c.in_stock_str=await s.getText(),c.in_stock_str.indexOf("Привезем")>=0)console.log("  т.к. они что то привезут, значит в магазине нет");else{let e=t(c.in_stock_str);if(c.in_stock=e>0?e:0,console.log("  не привезут, есть ",c.in_stock),c.available>0){let e=c.in_stock_str.split(" ");c.ed_izm=e.pop()}""!=a&&c.in_stock>0&&await r(o,"sd_goods_in_shop",["good_uri","address","sheldule","in_stock_str","in_stock"],c)}}catch(e){console.error("ошибка получения на складе"),console.error(e)}s.push(c)}catch(e){}}catch(e){console.error("-- SD_GoodFullParserGetOnSklad err"),console.error(e)}return s},y=async(e,t={},o,a,r,l)=>{if(console.log("start SD_GoodFullParser ",t),!await C(e,t))return console.log("загружена НЕ тот товар"),!1;{console.log("загружена ТОТ товар"),await e.sleep(2e3),await u(e,3),await e.sleep(3e3);let s={options:[]};s.options=await h(e,a,r,t.uri),s.onSklad=await w(e,a,r,t.uri,l),s.good=await m(e,o,a);try{return console.log("++ SD_GoodFullParser res ",s),s}catch(e){return console.log("-- parserGoodMini ошибка скана цены"),!1}}},m=async(e,t,o)=>{let a={kod:0,price:[]};try{let t=await D(e,'//sd-product-intro/div/span[@class="code"]',5),r=await t.getText();a.kod=await o(r)}catch(e){}try{let t=await D(e,'//div[@class="content with-gradient"]',5);a.opis=await t.getText()}catch(e){console.error("   err opis")}try{let o=await D(e,"//sd-available-price/sd-price/div/div/span",5),r=await o.getText(),s={price:0,name:""};s.price=await t(r);let c=await e.findElement(l.xpath("//sd-available/ui-unit-tab/button"));s.name=await c.getText(),a.price.push(s)}catch(e){console.log("   SD_GoodFullGoodParser ошибка скана цены")}return a},f=e=>{let t=e.split("/").pop();try{return t.split("?")[0]}catch(e){return t}},_=async(e,t)=>{try{console.log("uri",t),await e.get(t)}catch(e){console.error(" loadPage / error exit"),console.error(e)}},x=async(e,t)=>{try{await b(e),await e.sleep(3e3);let o="//ui-categories-menu/ui-desktop-categories-menu/nav/div/ul[1]/li[1]/ui-custom-generic-link/a";e.executeScript(" document.evaluate('"+o+"', document, null, XPathResult.ANY_TYPE, null).href = '"+t+"' "),await e.sleep(1e3),(await e.findElement(l.xpath(o))).click(),await e.sleep(3e3)}catch(e){console.error("-- SDGoToCatNavFast err"),console.error(e)}},S=async(e,t,o="")=>{0==o.length&&(o=t.l0),await b(e);try{let a=[];t.l3&&t.l3.length>0?(a.push({l:t.l0,n:t.n0}),a.push({l:t.l1,n:t.n1}),a.push({l:t.l2,n:t.n2}),a.push({l:t.l3,n:t.n3})):t.l2&&t.l2.length>0?(a.push({l:t.l0,n:t.n0}),a.push({l:t.l1,n:t.n1}),a.push({l:t.l2,n:t.n2})):t.l1&&t.l1.length>0&&(a.push({l:t.l0,n:t.n0}),a.push({l:t.l1,n:t.n1}));let r=await k(e,a,o);return console.log("SDGoToCat 6871 ",r),await e.sleep(3e3),console.log("++-- SDGoToCatNav"),!0}catch(e){console.error("-- SDGoToCatNav err"),console.error(e)}return console.log("++-- SDGoToCatNav"),!1},k=async(e,t,o,a=1)=>{try{1==a&&await b(e);let r=await L(e,a);try{if(0==r)throw console.error(""),console.error(""),console.error(""),console.error("не получилось загрузить страницу"),console.error(""),console.error(""),console.error(""),"не получилось загрузить страницу";let l=t.pop().n;for(let s of r){let r=await s.getText();try{if((await s.getAttribute("html")).indexOf(o)>=0)return s.click(),console.log("7755 return true;"),!0}catch(e){}if(l.length>0){if(l!=r)continue;if(await e.sleep(3e3),await v(e),console.log("   gogoE.length",t.length),0==t.length){try{await s.click()}catch(e){console.error("-- 7737 ош клик")}await e.sleep(3e3),await v(e);let t=await D(e,"//sd-product-grid-header/sd-product-list-title/h1",3);return(await t.getText()).indexOf(l)>=0?(console.log("77 return true;"),!0):(console.log("77 return false;"),!1)}{let r=e.actions({async:!0});await r.move({origin:s}).perform(),await e.sleep(2e3),await v(e),await e.sleep(3e3);let l=a+1;await k(e,t,o,l)}}}}catch(e){console.log("err ---------- SDGoToCat 2 - SDgetListCats")}}catch(e){console.log("SDGoToCat: err 1 "),console.log("err",e)}},v=async(e,t="/root/ml/dist/img/11.png")=>{try{await e.takeScreenshot().then((function(e,o){require("fs").writeFile(t,e,"base64",(function(e){e&&console.log("img error",e)}))})),console.log("   screenshot good: ",t)}catch(e){console.log("ошибка создания скрина")}},T=async e=>{try{let t=await e.findElement(l.xpath('//ui-city-defined-dialog/div/div[2]/button[@class="btn-close"]'));await t.click()}catch(e){}},G=async(e,t,o)=>{try{await e.sleep(500),await v(e);let a=await e.findElement(l.xpath('//form[@class="search-form"]/div/input'));try{a.clear(),await e.sleep(50),a.sendKeys(t.name),await e.sleep(50),(await e.findElement(l.xpath('//form[@class="search-form"]/button[1]'))).click(),await e.sleep(2e3),await v(e),await e.sleep(3e3),await u(e,2),await e.sleep(500);try{let a=await N(e,'//div[@class="product"]');for(let e of a){let a=await g(e,o);try{if(console.log("good1"),console.log("good1",a.name),console.log("good1",a.kod," / ",t.kod),a.kod==t.kod){await console.log("это он! товар найден");let t=await e.findElement(l.xpath('./a[@class="product-name"]'));await t.click();break}}catch(e){console.error("ошибка перебора")}}await e.sleep(500),await v(e)}catch(e){return console.error("-- err ошибка поиска результатов поиска"),!1}}catch(e){console.log("-- err searchAndGoGood ошибка ввода или клика по форме поиска")}}catch(e){console.log("-- err searchAndGoGood ошибка поиска формы поиска")}},b=async e=>{try{await e.wait(c.elementLocated(l.xpath('//button[@class="cx-hamburger is-active"]')),3e3)}catch(t){try{let t=await e.wait(c.elementLocated(l.xpath('//ui-desktop-categories-menu/button[@class="cx-hamburger"]')),1e4);await t.click()}catch(e){return console.log(" - SDclickToCatBurger 21 ошибка клика по бургеру меню"),!1}}await v(e)},E=async(e,t)=>{try{let o=await D(e,"//sd-product-grid-header/sd-product-list-title/h1",2);if((await o.getText()).indexOf(t)>-1)return!0}catch(e){}return!1},C=async(e,t)=>{try{let o=await D(e,"//cx-page-layout/cx-page-slot[1]/sd-product-intro/h1",2);if((await o.getText()).indexOf(t.name)>-1){let o=await D(e,"//cx-page-layout/cx-page-slot[1]/sd-product-intro/div/span",2);return(await o.getText()).indexOf(t.kod),!0}}catch(e){}return!1},D=async(e,t,o=10)=>{try{return await e.wait(c.elementLocated(l.xpath(t)),1e3*o),await e.findElement(l.xpath(t))}catch(e){return console.log("err xPathLoadWait ",t),!1}},N=async(e,t,o=10)=>{try{return await e.wait(c.elementLocated(l.xpath(t)),1e3*o),await e.findElements(l.xpath(t))}catch(e){return console.log("err xPathLoadWaites ",t),!1}},O=async e=>{try{close_ip_msg=await e.wait(c.elementLocated(l.xpath('//ui-city-defined-dialog/div/div[2]/button[@class="btn-close"]')),5e3),await close_ip_msg.click(),console.log("ОК закрытия верх плашки","clickCloseUpModal")}catch(e){console.log("ошибка закрытия верх плашки","clickCloseUpModal")}},L=async(e,t)=>{console.log("++ SDgetListCats start ",t);try{return await e.wait(c.elementLocated(l.xpath("//ui-desktop-categories-menu/nav/div/ul["+t+"]")),3e3),await e.findElements(l.xpath("//ui-categories-menu/ui-desktop-categories-menu/nav/div/ul["+t+"]/li"))}catch(e){return console.log("-- SDgetListCats err"),console.log(e),!1}}},951:(e,t,o)=>{"use strict";o.r(t),o.d(t,{onlyNumber:()=>r,priceNormalizator:()=>a});const a=e=>parseFloat(e.replace(" ","")),r=e=>parseInt(e.replace(/[^0-9]/g,""))},816:(e,t,o)=>{"use strict";o.r(t),o.d(t,{SD_GetCatForScan:()=>n,SD_getGoodForParse:()=>d,connect:()=>r,creatScreenshot:()=>c,exit:()=>l,loadPage:()=>s,saveToDb:()=>u,sql:()=>i});const a=require("mysql2/promise"),r=async()=>await a.createConnection({host:"localhost",database:"parser1",user:"root",password:"123456"}),l=e=>{try{e.end(),console.log("Подключение mysql закрыто")}catch(e){console.log("Ошибка: "+e)}},s=async(e,t)=>{try{console.log("uri",t),await e.get(t)}catch(e){console.error(" loadPage / error exit"),console.error(e)}},c=async(e,t)=>{try{e.takeScreenshot().then((function(e,o){require("fs").writeFile(t,e,"base64",(function(e){console.log("img error",e)}))})),console.log("screenshot good: ",t)}catch(e){console.log("ошибка создания скрина")}},i=async(e,t,o,a=1)=>{try{const[r,l]=await e.execute(t,o);return 2==a?{rows:r,fields:l}:r}catch(e){return console.log("sql error: ",e),!1}},n=async e=>{let t=await i(e,"SELECT  s.link l0, s.name n0,  s1.link l1, s1.name n1,  s2.link l2, s2.name n2,  s3.link l3, s3.name n3  FROM `sd_cat` s  LEFT JOIN sd_cat s1 ON s1.link = s.catup_uri  LEFT JOIN sd_cat s2 ON s2.link = s1.catup_uri  LEFT JOIN sd_cat s3 ON s3.link = s2.catup_uri  WHERE s.type <= ? AND s.scan_start IS NULL LIMIT ? ",[4,50]);for(let o of t){console.log("1"),await i(e,"UPDATE `sd_cat` SET `scan_start` = NOW() WHERE `sd_cat`.`link` = ?; ",[o.l0]);let t=!0;try{t=!0;let e=Object.values(o);for(let o of e)"Новое в ассортименте"!=o&&" Сезонные товары "!=o||(t=!1);if(0==t)continue;return o}catch(e){throw console.error("sql -- SD_GetCatForScan err"),console.error(e),"sql -- SD_GetCatForScan err "+e}}},d=async e=>{let t=await i(e,"SELECT  g.*  FROM `sd_good` g  WHERE  g.start_update IS NULL OR  g.start_update - INTERVAL 2 DAY > NOW() LIMIT ? ",[1]);for(let o of t)return await i(e,"UPDATE `sd_good` SET `start_update` = NOW() WHERE `uri` = ?; ",[o.uri]),o},u=async(e,t,o,a)=>{try{let r="",l="",s=[];for(let e of Object.values(o))"created_at"==e||"updated_at"==e||"deleted_at"==e?(r+=(r.length>0?", ":"")+e,l+=(l.length>0?", ":"")+" NOW() "):Object.prototype.hasOwnProperty.call(a,e)&&(r+=(r.length>0?", ":"")+e,l+=(l.length>0?", ":"")+" ? ",s.push(a[e]));const c="INSERT INTO "+t+" ( "+r+" ) VALUES( "+l+" ) ",[i]=await e.execute(c,s);return i}catch(e){return e.toString().indexOf("plicate entry")>=0?console.log("db insert: уже есть"):(console.log("ошибка в запросе на добавление ",e),console.log(e)),!1}}}},t={};function o(a){var r=t[a];if(void 0!==r)return r.exports;var l=t[a]={exports:{}};return e[a](l,l.exports,o),l.exports}o.d=(e,t)=>{for(var a in t)o.o(t,a)&&!o.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{const{connect:e,exit:t,SD_GetCatForScan:a,saveToDb:r}=o(816),{connect:l,exit:s,loadPage:c,creatScreenshot:i,pageScrollToBottom:n,clickCloseUpModal:d}=o(203),{UpModalCityClose:u,loadGoodsFromListCat:p,getCatLink:g,checkNowCat:h,xPathLoadWait:w,SDGoToCatNav:y,SDGoToCatNavFast:m}=o(203),{SD_getGoodForParse:f}=o(816),{searchAndGoGood:_,checkNowGood:x,SD_GoodFullParser:S}=o(203),{priceNormalizator:k,onlyNumber:v}=o(951);(async e=>{try{https.request(uri)}catch(e){console.error(e)}})()})()})();