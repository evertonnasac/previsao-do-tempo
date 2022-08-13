const searchNext = `forecast?` //parâmetro da url para consultar a previsão dos proximo dias
const searchCity = `weather?` //parâmetro da url para consultar a previsão do dia atual

//search: o parametro para definir o tipo de consulta 
//city: o nome cidade recuperada nos campos da pagina
//country: a sigla do país recuperada nos campos da pagina
//lang: a linguagem selecionada pelo usuário
async function getWeather(search, lat, lon, lang){

    try{

        let unit = localStorage.getItem("temp") || "metric"
        const key = "c85c800507b036d7fa63f60c7a49ed39"
        const url = 
        `https://api.openweathermap.org/data/2.5/${search}lat=${lat}&lon=${lon}`+
        `&appid=${key}&lang=${lang}&units=${unit}`

        let data = await fetchApi(url)

        console.log(data)

        return data

    }
    catch(e){

    }
    

}

async function getPresisionPlace(value){

    try{

        const url = 
        `https://nominatim.openstreetmap.org/search?city=${value}&format=json&addressdetails=[0|1]`
    
        let data = await fetchApi(url)
    
        return data
    }
    
    catch(e){
        
    }
   


}

async function fetchApi(url){

    let response = await fetch(url)
    let data = await response.json()

    //Retorna os dados convertidos em json
    return data

}


export {
    searchCity,
    searchNext,
    getWeather,
    getPresisionPlace
}