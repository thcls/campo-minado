let cronometro
let time;
const d = {
    INICIANTE: 0,
    INTERMEDIARIO:1,
    EXPERTE: 2,
}

if(localStorage.getItem('times')===null){
    const ts = [[null,null,null],[null,null,null],[null,null,null]]
    const timesJSON = JSON.stringify(ts)
    localStorage.setItem('times',timesJSON)
}
export function cronoStart(){
    clearInterval(cronometro)
    const timer = document.querySelector('.timer')
    cronometro = setInterval(function(){
        time.setMilliseconds(time.getMilliseconds()+10)
        timer.innerHTML = `${String.fromCodePoint(0x23f2)} ${time.toLocaleTimeString('pt-BR',{hour12:false,timeZone:'GMT'}).slice(3)}.${getHundredth(time)}`
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
    const status = document.querySelector('.status')
    if(gameOver){
        status.style.color = timer.style.color = '#FF0000'
    }else{
        status.style.color = timer.style.color = '#008000'
    }
}
export function cronoZero(){
    time = new Date(0)
    clearInterval(cronometro)
    const result = document.querySelector('.result')
    result.innerText = ''
    const status = document.querySelector('.status')
    const timer = document.querySelector('.timer')
    status.style.color = timer.style.color = '#000000'
    
    timer.innerHTML = String.fromCodePoint(0x23f2) + ' 00:00.00'
}
export function cronoTime(dificult){
    const t = getTimes()
    const times = t[d[dificult]]
    
    times.push(`${time.getMinutes()}:${time.getSeconds()}.${getHundredth(time)}`)
    times.sort()
    times.pop()
    setTimes(dificult,times)
    showTimes(dificult)
}
export function getTimes(){
    const times = localStorage.getItem('times')
    const t = JSON.parse(times)
    return t
}
export function setTimes(dificult,array){
    const ts = getTimes()
    
    for (let i = 0;i < 3;i++){
        ts[d[dificult]][i] = array[i]
    }
    const timesJSON = JSON.stringify(ts)
    localStorage.setItem('times',timesJSON)
}
export function showTimes(dificult){
    const t = getTimes()
    const times = t[d[dificult]]

    const places = document.querySelectorAll('.place')
    const medals = [`${String.fromCodePoint(0x1F947)}`,`${String.fromCodePoint(0x1F948)}`,`${String.fromCodePoint(0x1F949)}`]
    for(let i = 0;i < 3;i++){
        if(times[i]){
            places[i].innerText = `${medals[i]}  ${times[i]}`
        }else{
            places[i].innerText = `${medals[i]}  --:--.--`
        }
    }
}