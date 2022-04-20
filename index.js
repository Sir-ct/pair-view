async function main(){
    let combdata = []
    let biku = []
    let biga = []
    let biby = []
    let kuga = []
    let kuby = []
    let gaby = []
    let usable = []
    let usdt = /USDT/
    let table = document.getElementById("table")


    let proxy = "https://t-proxy-server.herokuapp.com"

    let prev = document.getElementById("prev")
    let next = document.getElementById("next")

    let startindex = 0
    let numperpage = 500




          //fetch binance data
          let binance = await fetch(proxy).catch(err=>{
            table.innerHTML = "connection error: try refreshing page"
          })
          let binancedata = await binance.json()
          let bindata = []
             for(let i=0; i < binancedata.length; i++){
                 if(usdt.test(binancedata[i].symbol)){
                     combdata.push(binancedata[i])
                     bindata.push(binancedata[i])
                 }
             }
             console.log(bindata)
 

    

        //fetch kucoin data
    let kucoin = await fetch(proxy+"/kucoin").catch(err=>{
        table.innerHTML = "connection error: try refreshing page"
    })
    let kucoindata = await kucoin.json()
    let kudata = []
        console.log("kucoin: ", kucoindata.data.ticker)
        for(let i=0; i < kucoindata.data.ticker.length; i++){
            if(usdt.test(kucoindata.data.ticker[i].symbol)){
                combdata.push(kucoindata.data.ticker[i])
                kudata.push(kucoindata.data.ticker[i])
            }
        }
        console.log(kudata)


         //fetch gateio data
    let gateio = await fetch(proxy+"/gateio").catch(err=>{
        table.innerHTML = "connection error: try refreshing page"
        return
    })
    let gateiodata = await gateio.json()
    let gadata = []
    console.log("gateio: ", gateiodata)
        for(let i=0; i < gateiodata.length; i++){
            if(usdt.test(gateiodata[i]["currency_pair"])){
            combdata.push(gateiodata[i])
            gadata.push(gateiodata[i])
            }
        }
   console.log(gadata)

    //fetch bybit data
    let bybit = await fetch(proxy+"/bybit").catch((err)=>{
            table.innerHTML = "connection error: try refreshing page"
        
    })
    let bybitdata = await bybit.json()
    let bydata = []
            console.log("bybit: ", bybitdata.result)
        for(let i=0; i < bybitdata.result.length; i++){
            if(usdt.test(bybitdata.result[i].symbol)){
                combdata.push(bybitdata.result[i])
                bydata.push(bybitdata.result[i])
            }
        }
        console.log(bydata)
 
        //comparing binance to all (kucoin, gateio, bybit) in this order by
        // adding all currency pairs that also appear in them to the binance array as a new array
      //1 bi-ku
        for(let i=0; i<bindata.length; i++){
            for(let j=0; j<kudata.length; j++){
                if(bindata[i].symbol == kudata[j].symbol.replace(/-/, "")){
                    biku.push(bindata[i])
                    biku.push(kudata[j])
                }
            }
        }
        //2 bi-ga
        for(let i=0; i<bindata.length; i++){
            for(let j=0; j<gadata.length; j++){
                if(bindata[i].symbol == gadata[j]["currency_pair"].replace(/_/, "")){
                    biga.push(bindata[i])
                    biga.push(gadata[j])
                }
            }
        }
        //3 bi-by
        for(let i=0; i<bindata.length; i++){
            for(let j=0; j<bydata.length; j++){
                if(bindata[i].symbol == bydata[j].symbol){
                    biby.push(bindata[i])
                    biby.push(bydata[j])
                }
            }
        }
        
        //comparing kucoin to the rest
        //4 ku-ga
        for(let i=0; i<kudata.length; i++){
            for(let j=0; j<gadata.length; j++){
                if(kudata[i].symbol.replace(/-/, "") == gadata[j]["currency_pair"].replace(/_/, "")){
                    kuga.push(kudata[i])
                    kuga.push(gadata[j])
                }
            }
        }

        //5 ku-by
        for(let i=0; i<kudata.length; i++){
            for(let j=0; j<bydata.length; j++){
                if(kudata[i].symbol.replace(/-/, "") == bydata[j].symbol){
                    kuby.push(kudata[i])
                    kuby.push(bydata[j])
                }
            }
        }

        // comparing gateio to the rest
        //6 ga-by
        for(let i=0; i<gadata.length; i++){
            for(let j=0; j<bydata.length; j++){
                if(gadata[i]["currency_pair"].replace(/_/, "") == bydata[j].symbol){
                    gaby.push(gadata[i])
                    gaby.push(bydata[j])
                }
            }
        }

        // merging all in one array
        for(let i=0; i<biku.length; i++){
            usable.push(biku[i])
        }
        for(let i=0; i<biga.length; i++){
            usable.push(biga[i])
        }
        for(let i=0; i<biby.length; i++){
            usable.push(biby[i])
        }
        for(let i=0; i<kuga.length; i++){
            usable.push(kuga[i])
        }
        for(let i=0; i<kuby.length; i++){
            usable.push(kuby[i])
        }
        for(let i=0; i<gaby.length; i++){
            usable.push(gaby[i])
        }

       

        usable.sort((a, b)=>{
            let asymbol = a.symbol
            let acp =  a["currency_pair"]
            let bsymbol = b.symbol
            let bcp = b["currency_pair"]

           let fa = asymbol || acp , 
           fb = bsymbol|| bcp

           if(fa < fb){
               return -1
           }

           if(fa > fb){
               return 1
           }

           return 0
        })

    console.log("binance-kucoin", biku)
    console.log("binance-gateio", biga)
    console.log("binance-bybit", biby)
    console.log("kucoin-gateio", kuga)
    console.log("kucoin-bybit", kuby)
    console.log("gateio-bybit", gaby) 
    console.log(usable)
    console.log(combdata)
        
    renderPage(usable, startindex, numperpage)

    prev.addEventListener("click", ()=>{
        if(startindex > 0){
            startindex -= 500
            numperpage -= 500

            table.innerHTML = "loading previous page"

            console.log(startindex, numperpage)
            renderPage(usable, startindex, numperpage)
        }
    })

    next.addEventListener("click", ()=>{
        if(startindex < usable.length){
            startindex += 500
            numperpage += 500

            table.innerHTML = "loading next page"

            console.log(startindex, numperpage)
            renderPage(usable, startindex, numperpage)
        }
    })
}

function renderPage(data, startindex, numperpage){
    let table = document.getElementById("table")
    
    table.innerHTML = ""

    for(let i=startindex; i<numperpage; i++){
        table.innerHTML += `
        <div class="row">
            <div class="sn">${i + 1}</div>
            <div class="exchange">${exchange(data[i])}</div>
            <div class="symbol">${data[i].symbol || data[i]["currency_pair"]}</div>
            <div class="price">${data[i].lastPrice || data[i].last || data[i].last_price}</div>
        </div>
        `
      }

      console.log("done")

      // function to set the name of the exchange depending on some characteristics of the object(which are peculiar to each exchange only)
     function exchange(obj){
        if(obj.askPrice && obj.askQty && obj.bidPrice){
            return "Binance"
        }

        if(/-/.test(obj.symbol)){
            return "Kucoin"
        }

        if(obj.currency_pair){
            return "Gate.io"
        }

        if(obj.ask_price && obj.bid_price && obj.countdown_hour){
            return "Bybit"
        }
       
    }
}

window.addEventListener("load", main)