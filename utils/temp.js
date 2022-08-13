
//Funcão que converte a temperatura de celsius para fahrenheit
const convertCtoF = (celc) => {

    let far = celc * 1.8 + 32

    return far

}

////Funcão que converte a temperatura de fahrenheit para  celsius
const convertFtoC = (far) => {

    let celc = (far - 32) / 1.8

    return celc
}

export  {
    convertCtoF, 
    convertFtoC
}


