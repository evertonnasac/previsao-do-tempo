import {convertCtoF, convertFtoC} from "../utils/temp.js"

//btn: botão de troca de unidade de temperatura para atualizar a posição
//temps: Elementos com os valores da temperatura renderizados 
const handleTemp = ({temp, temp_min, temp_max}) => {


    let unit = localStorage.getItem("temp") 

    const changeTemp = (unit) => {

        const operation = {
            metric :  convertCtoF,
            imperial : convertFtoC,
        }
        return operation[unit]
    }

    return updateTemp(changeTemp(unit), {temp, temp_min, temp_max}) 
    
}

//Atualiza os valores de temperatura de acordo com a unidade de medida selecionada
//Recebe a fóruma e os elementos a serem  atualizados
const updateTemp = (formula, infotemp) => {

    let updatedTemp = {
        temp : formula(infotemp.temp),
        tempMin : formula(infotemp.temp_min),
        tempMax : formula(infotemp.temp_max),
    }

    return updatedTemp
}

//Realiza a troca de posição do botão de seleção de temperatura
const setPositionBtnTemp = () =>{

    let temp = localStorage.getItem("temp")

    return {
        metric : "0px",
        imperial : "20px"

    }[temp]

}

const toggleTemp = () =>{

    let temp = localStorage.getItem("temp")
    temp == "metric" ? 
    localStorage.setItem("temp", "imperial") :
    localStorage.setItem("temp", "metric") 
    

}

export  {
    handleTemp,
    setPositionBtnTemp,
    toggleTemp
}