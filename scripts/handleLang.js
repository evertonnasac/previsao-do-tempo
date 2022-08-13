//Guarda ou busca o idioma selecionado no localstorage

const handleLanguage = (() => {
    return{
        setLang : (lang) => localStorage.setItem("lang", lang),
        getLang : () => localStorage.getItem("lang") || "pt_br"
    }

})()

export default handleLanguage
