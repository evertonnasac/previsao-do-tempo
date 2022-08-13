import  handleLanguage  from "./handleLang.js"
import {handleTemp, setPositionBtnTemp, toggleTemp} from "./handleTemp.js"
import lang from "../utils/lang.js"
import { searchCity, getWeather } from "../utils/api.js"

const divBack = document.querySelector(".back")
const btnSwapTemp = document.querySelector(".btn-swap-temp")
const divSwapTemp = document.querySelector(".swap-temp")
const pNameCity = document.querySelector(".city-name")
const pDescription = document.querySelector(".description")
const pTemp = document.querySelector(".temp-value")
const pTempMin = document.querySelector(".temp-min")
const pTempMax = document.querySelector(".temp-max")
const imgIcon = document.querySelector(".icon")
const linkNextDays = document.querySelector(".link-next-days")
const btnPt = document.querySelector(".pt-br")
const btnEng = document.querySelector(".eng")
const btnEsp = document.querySelector(".esp")
const pLang  = document.querySelector(".lang-current")


const urlParans = new URLSearchParams(window.location.search)
const lat = urlParans.get("lat")
const lon = urlParans.get("lon")

//Botão de voltar a tela anterior
const back = () =>{

    window.location.href = "../index.html"
}

const infoWeather = (() =>{

    let info = {}

    return{

        setInfo : ({main, weather, name}) => {
            
            info.city = name
            info.temp = main.temp
            info.temp_max = main.temp_max
            info.temp_min = main.temp_min
            info.description = weather[0].description
            info.icon = weather[0].icon

            showWeather()
        },

        changeTemp : ({temp, tempMax, tempMin}) => {
            
            info.temp = temp
            info.temp_max = tempMax
            info.temp_min = tempMin

            showWeather()
        },

        getInfo : () =>  JSON.parse(JSON.stringify(info))
    }

})()


//Configurano o idioma selecionado
const getLanguage = () =>{
    
    let lang = handleLanguage.getLang()

    const langs = {
        pt_br : {
            link: "Ver previsão para os próximos 5 dias",
            currentLang : "Idioma selecionado: PORTUGUES"
        },
        en : {
            link: "See forecast for the next 5 days",
            currentLang: "Selected language: ENGLISH"
        },
        es : {
            link: "Ver pronóstico para los próximos 5 días",
            currentLang: "Idioma seleccionado: ESPAÑOL"
        }
    }

    return langs[lang]
    
    
}

//Renderiza os dados nos elementos HTML retornados da API
const showWeather = () => {

    console.log(infoWeather.getInfo())

    pDescription.innerHTML = infoWeather.getInfo().description
    pNameCity.innerHTML = infoWeather.getInfo().city.toUpperCase()
    pTemp.innerHTML = `${Math.trunc(infoWeather.getInfo().temp)}°` 
    pTempMax.innerHTML = `${Math.trunc(infoWeather.getInfo().temp_max)}°`
    pTempMin.innerHTML = `${Math.trunc(infoWeather.getInfo().temp_min)}°`

    linkNextDays.setAttribute("href", `./next-days.html?lat=${lat}&lon=${lon}`)

    imgIcon.setAttribute("src",`http://openweathermap.org/img/wn/${infoWeather.getInfo().icon}.png`)

}



//Função executada no carregamento da pagina
const init =  async () =>{

    btnSwapTemp.style.left = setPositionBtnTemp()

    linkNextDays.innerHTML = getLanguage().link

    pLang.innerText = getLanguage().currentLang


    //Chama a função que realiza a requisição  da API e obtem dos dados em json
    let data = await getWeather(searchCity, lat, lon, handleLanguage.getLang())

    infoWeather.setInfo(data)
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

    let infoUpdated = handleTemp(infoWeather.getInfo())

    infoWeather.changeTemp(infoUpdated)
    
    btnSwapTemp.style.left = setPositionBtnTemp()
    
    toggleTemp()
})

divBack.addEventListener("click", back)

init()


 


