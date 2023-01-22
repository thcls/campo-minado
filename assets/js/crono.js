let cronometro

export function cronoStart(){
    let time = new Date(0)
    clearInterval(cronometro)
    const timer = document.querySelector('.timer')
    cronometro = setInterval(function(){
        time.setMilliseconds(time.getMilliseconds()+10)
        timer.innerHTML = `${time.toLocaleTimeString('pt-BR',{hour12:false,timeZone:'GMT'}).slice(3)}.${getHundredth(time)}`
    }, 10)
}
export function getHundredth(time){
    let hundredth = String((time.getMilliseconds()/10).toFixed(0))
    if (hundredth === '100'){
        return '00'
    }else if(hundredth.length === 1){
        return '0' + hundredth
    }
    else{
        return hundredth
    }
}
export function cronoStop(gameOver){
    clearInterval(cronometro)
    const timer = document.querySelector('.timer')
    if(gameOver){
        timer.style.color = '#FF0000'
    }else{
        timer.style.color = '#008000'
    }
}
export function cronoZero(){
    clearInterval(cronometro)
    const result = document.querySelector('.result')
    result.innerText = ''
    const timer = document.querySelector('.timer')
    timer.style.color = '#FFFFFF'
    timer.innerHTML = '00:00.00'
}
