import { searchNext, getWeather } from "../utils/api.js"
import {handleTemp, setPositionBtnTemp, toggleTemp} from "./handleTemp.js"
import handleLanguage from "./handleLang.js"
import lang from "../utils/lang.js"

const divBack = document.querySelector(".back")
const btnSwapTemp = document.querySelector(".btn-swap-temp")
const divSwapTemp = document.querySelector(".swap-temp")
const divContainer = document.querySelector(".container")
const btnPt = document.querySelector(".pt-br")
const btnEng = document.querySelector(".eng")
const btnEsp = document.querySelector(".esp")
const pLang  = document.querySelector(".lang-current")


const urlParans = new URLSearchParams(window.location.search)
const lat = urlParans.get("lat")
const lon = urlParans.get("lon")

//Retorna a página anterior
const back = () =>{
    window.location.href = 
    `./infotemp.html?lat=${lat}&lon=${lon}`
}


const infoWeather = (() =>{

    let info = {}

    return{

        setInfo : ({city, list}) => {
            
            info.city = city.name
            info.list = [list[5], list[13], list[21], list[29], list[37]]

            showWeather()
        },

        changeTemp : (list) => {
            
            info.list = list
            showWeather() 
        },

        getInfo : () => {

            return JSON.parse(JSON.stringify(info))
        }
    }

})()


//Configurano o idioma selecionado
const getLang = () => {

    let lang = handleLanguage.getLang()

    const langs = {
        pt_br : {
            dateFormat : "pt-BR",
            subtitle : "Previsão para 5 dias",
            currentLang: "Idioma selecionado: PORTUGUES"

        },
        en : {
            dateFormat : "en-US",
            subtitle : "Forecast for 5 days",
            currentLang: "Selected language: ENGLISH"
        },
        es : {
            dateFormat : "es-ES",
            subtitle : "Pronostico para 5 dias",
            currentLang: "Idioma seleccionado: ESPAÑHOL"
        }
        
    }

    return langs[lang]
}

//configura a formatação a data para ser renderizada
const setLangDate = (date) => {

    let lang = getLang().dateFormat

    const option = {
        month: "short",
        day: "numeric",
        weekday : "short",
        dataStyle : "medium"

    }

    date = date.toLocaleString(lang, option)

    return  date
}



//Renderiza os dados nos elementos HTML retornados da API
const showWeather = () =>{

    /*O endpoint consultado para a previsão de 5 dias,
     retorna a previsão de 14 dias em um passo de 3 em 3 horas
     Entao foi necessario extrair apenas 5 posições do array da resposta
     de forma estratégica e armazenar no array chamado ListDays*/ 

    //et listDays = new Array(list[5], list[13], list[21], list[29], list[37])

    let info = infoWeather.getInfo()

    divContainer.innerHTML = ""

    let pCity = document.createElement("p")
    pCity.innerText = info.city.toUpperCase()
    pCity.classList.add("city-name")
    divContainer.appendChild(pCity)

    let pSubTitle = document.createElement("p")
    pSubTitle.innerText = getLang().subtitle
    pSubTitle.classList.add("next-subtitle")
    divContainer.appendChild(pSubTitle)
    

    info.list.forEach(element => {

        let divInfo = document.createElement("div")
        divInfo.classList.add("next-day-info")

        let pDate = document.createElement("p")
        pDate.classList.add("next-date")
        let date = setLangDate(new Date(element.dt_txt))
        pDate.innerText = date
        divInfo.appendChild(pDate)

        let divImage = document.createElement("div")
        let img = document.createElement("img")
        img.setAttribute("src",`http://openweathermap.org/img/wn/${element.weather[0].icon}.png`)
        img.classList.add("next-icon")
        divImage.appendChild(img)
        divInfo.appendChild(divImage)
        
        let pMin = document.createElement("p")
        pMin.classList.add("next-temp")
        pMin.classList.add("temp")
        pMin.innerHTML = `${Math.trunc(element.main.temp_min)}°`
        divInfo.appendChild(pMin)

        let divBar = document.createElement("div")
        divBar.classList.add("next-bar")
        divInfo.appendChild(divBar)

        let pMax = document.createElement("p")
        pMax.classList.add("next-temp")
        pMax.classList.add("temp")
        pMax.innerHTML = `${Math.trunc(element.main.temp_max)}°`
        divInfo.appendChild(pMax)

        let pDesc = document.createElement("p")
        pDesc.classList.add("next-description")
        pDesc.innerHTML = element.weather[0].description
        divInfo.appendChild(pDesc)
        
        divContainer.appendChild(divInfo)

    })
}


btnPt.addEventListener("click", () =>{
    handleLanguage.setLang(lang.portugues)
    init()
})

btnEng.addEventListener("click", () =>{
    handleLanguage.setLang(lang.ingles)
    init()
})
btnEsp.addEventListener("click", () =>{
    handleLanguage.setLang(lang.espanhol)
    init()
})

divSwapTemp.addEventListener("click", () =>{

    let info = infoWeather.getInfo().list


    info.forEach(({main}) => {
    
        let updatedTemp = handleTemp(main)

        main.temp = updatedTemp.temp
        main.temp_max = updatedTemp.tempMax
        main.temp_min = updatedTemp.tempMin
    })

    infoWeather.changeTemp(info)

    toggleTemp()

    btnSwapTemp.style.left = setPositionBtnTemp()

})

divBack.addEventListener("click", back)

//Função executada no carregamento da pagina
const init = async () =>{

    btnSwapTemp.style.left = setPositionBtnTemp()

    pLang.innerText = getLang().currentLang

    let lang = handleLanguage.getLang()

    //Chama a função que realiza a requisição  da API e obtem dos dados em json
    let data = await getWeather(searchNext, lat, lon, lang)

    infoWeather.setInfo(data)

    showWeather(data)
    
}


init()