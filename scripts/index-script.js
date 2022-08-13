
import lang from "../utils/lang.js"
import handleLang from "./handleLang.js"
import { handleTemp, setPositionBtnTemp } from "./handleTemp.js"
import {getPresisionPlace} from "../utils/api.js"

const divSwapTemp = document.querySelector(".swap-temp")
const btnSwapTemp = document.querySelector(".btn-swap-temp")
const pTitle = document.querySelector(".title")
const txtCity = document.querySelector("#city")
const btnPt = document.querySelector(".pt-br")
const btnEng = document.querySelector(".eng")
const btnEsp = document.querySelector(".esp")
const pLang  = document.querySelector(".lang-current")
const ulSuggest = document.querySelector(".suggest")



//Configurano o idioma selecionado
const getLang = () => {
    
    //Retorna o idioma salvo no localStorage atraves da função getLang no objeto handleLang
    let lang = handleLang.getLang()

    let langs = {
        pt_br : {
            title : "Como está o tempo hoje?",
            currentLang : "Idioma selecionado: PORTUGUES",
            placeHolder : "Digite a cidade"

        },
        en : {
            title: "How is the weather today?",
            currentLang: "Selected language: ENGLISH",
            placeHolder: "Enter the city",
        },
        es : {
            title :  "¿Como está el tiempo hoy?",
            currentLang: "Idioma seleccionado: ESPAÑOL",
            placeHolder: "Entrar en la ciudad"
        }
    }

    return langs[lang]

}

//Busca o lo cidades para preencher o autocomplete do campo cidade
const  getPlace = async (e) => {
    
    let value = e.target.value

    if(value.length < 2) {

        closeSuggest()
        return
    
    }


    let data =  await getPresisionPlace(value)

    let formatPlace =  getFormatPlace(data)

    if(!formatPlace){
        closeSuggest()
        return
    }

    fullSuggestionPlace(formatPlace)
}


const getFormatPlace = (data) =>{

    if(data.length < 1) {
        closeSuggest()
        return 
    }

   
    let local = data.map(({address, lat, lon}) => {

        let attributtes = Object.keys(address)

        let city = address.city || address[attributtes[0]]
        let state = address.state || address[attributtes[1]]
        let country = address.country

        let suggestion = `${city}, ${state}, ${country}`


        return {lat, lon, suggestion}
    } )

    return local
    
}


const fullSuggestionPlace = (formatPlace) => {

    ulSuggest.innerHTML = ""


    let suggest = formatPlace.map(({lat, lon, suggestion}) =>

        
        `<li lat = "${lat}" lon = ${lon}>${suggestion}</li>`
    ).join("")

    ulSuggest.style.display = "block"
    ulSuggest.innerHTML += suggest
    txtCity.style.borderBottomRadius = "0px"


    if(ulSuggest.firstChild){

        let nextSugest = ulSuggest.firstChild
        nextSugest.setAttribute("suggest-down","")
    }
    

}

const closeSuggest = () =>{

    ulSuggest.innerHTML = ""
    ulSuggest.style.display = "none"
    txtCity.style.borderBottomRadius = "10px"

}


const navigateSuggest = (e) => {

    
    if(ulSuggest.style.display == "block"){

        let sugestUp = document.querySelector("[suggest-up]")
        let currentSuggest = document.querySelector(".current-suggest")
        let suggestDown = document.querySelector("[suggest-down]")

        if(e.key == "ArrowDown"){


            suggestDown.classList.add("current-suggest")
            suggestDown.removeAttribute("suggest-down")

            if(suggestDown.hasAttribute("init")){
                ulSuggest.scrollTo(0, 0)
                suggestDown.removeAttribute("init")
            }

            if(currentSuggest){
                currentSuggest.setAttribute("suggest-up","")
                currentSuggest.classList.remove("current-suggest")
                ulSuggest.scrollBy(0,24)
            }

            if(sugestUp){
                sugestUp.removeAttribute("suggest-up")
            }

            if(suggestDown.nextElementSibling){
                
                suggestDown.nextElementSibling.setAttribute("suggest-down","")
            }

            else{

                ulSuggest.firstChild.setAttribute("suggest-down","")
                ulSuggest.firstChild.setAttribute("init","")

            }

        }

        if(e.key == "ArrowUp"){


            if(sugestUp){
                
                sugestUp.classList.add("current-suggest")
                sugestUp.removeAttribute("suggest-up")


                currentSuggest.classList.remove("current-suggest")
                currentSuggest.setAttribute("suggest-down","") 

                suggestDown.removeAttribute("suggest-down") 
    
                let nextSugestUp = sugestUp.previousElementSibling

                if(nextSugestUp){
    
                    nextSugestUp.setAttribute("suggest-up","")
    
                    ulSuggest.scrollBy(0, -24)
    
                
                }
                
                else{
    
                    sugestUp.removeAttribute("suggest-up")
                    currentSuggest.classList.remove("current-suggest")
                    ulSuggest.scrollBy(0, -24)
                    
                }

            }
           

        }  
        
    }

    
    
}

 //Salva a unidade de medida da temperatura na localstorage caso ainda não tenha
const initTemp = () =>{
    
    let temp = localStorage.getItem("temp")
    
    if(!temp){

        localStorage.setItem("temp", "metric")
    }
}


//Salva o idioma na localstorage caso ainda não tenha   
const initLang = () => {

    let lang = localStorage.getItem("lang")
    
    if(!lang){
        handleLang.setLang("pt_br")
    }
}


const init = () => {

    initLang()
    initTemp()

    //Seta a posição do botão de trocar a temperatura
    setPositionBtnTemp(btnSwapTemp)
    
    pTitle.innerText = getLang().title
    pLang.innerText = getLang().currentLang
    txtCity.placeholder = getLang().placeHolder

}


btnPt.addEventListener("click", () =>{
    handleLang.setLang(lang.portugues)
    init()
})


btnEng.addEventListener("click", () =>{
    handleLang.setLang(lang.ingles)
    init()
})

btnEsp.addEventListener("click", () =>{
    handleLang.setLang(lang.espanhol)
    init()
})

divSwapTemp.addEventListener("click", () =>{
    handleTemp(btnSwapTemp)
})

txtCity.addEventListener("keyup", (e) =>{

    if(e.key!="ArrowUp" && e.key!="ArrowDown" && e.key != "Enter"){
        getPlace(e)
    }

    else if(e.key == "ArrowDown" || e.key == "ArrowUp" ){
        navigateSuggest(e)
    }

    else if(e.key == "Enter"){
        
        
        let element = document.querySelector(".current-suggest")

        
        if(!element){
            return
        }
        let lat = element.getAttribute("lat")
        let lon = element.getAttribute("lon")

        if(lat && lon){
            window.location = `./pages/infotemp.html?lat=${lat}&lon=${lon}`
        }
       

    }

})


init()