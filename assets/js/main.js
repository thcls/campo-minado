document.addEventListener("mousedown", click)

const level = ['EXPERTE','INICIANTE', 'INTERMEDIARIO']
let firstClick = true
let bombsPosition = []
let gameover = false
let flags = []

function click(event){
    let element = event.target
    if (element.innerText === 'START') {
        generateField(getDificult(level)[0])
        firstClick = true
    }else if(element.innerText === 'RESET'){
        alert('eeeeeee')
    }
    else if(element.innerText === 'DIFICULT'||element.innerText === level[0]){
        let dificult = document.querySelector('.dificult')
        let aux = level.shift()
        level.push(aux)
        dificult.innerText = level[0]
    }
    else if(element.innerText === '|' && event.buttons === 2){
        console.log(event,event.target)
        let clicked = clickField(element)
        putFlag(clicked, element)
    }
    else if(element.innerText === '|'){
        if(firstClick){
            armBombs(getDificult(level))
            firstClick = false
        }
        let clicked = clickField(element)
        game(clicked)
    }
}
function armBombs(dificult){
    let [tam, bombsQtd] = dificult
    bombsPosition = []
    let i = 0
    while(i<bombsQtd){
        let position = `b${randomNum(tam)}|${randomNum(tam)}`
        let found = bombsPosition.find(element => element === position)
        if (found){
            continue
        }else{
            bombsPosition.push(position)
            i++
        }
    }
}
function clickField(element){
    let parent = element.parentNode
    let grandfather = parent.parentNode
    let line, column;
    
    line = parent.classList.value.slice(2)
    column = grandfather.classList.value.slice(2)
    let clicked = column+'|'+line

    return clicked
}
function putFlag(clicked, element){
    if(!findFlag(clicked)){
        flags.push('f'+clicked)
        let imgFlag = document.createElement('img')
        imgFlag.src = 'assets/images/icons/flag.png'
        element.style.backgroundImage = "url('assets/images/icons/flag.png')"
        element.style.backgroundSize = 'cover'
    }else{
        element.innerHTML = '|'
    }
}
function findFlag(clicked){
    clicked = 'f'+clicked
    for(flag of flags){
        if (clicked === flag){
            return true
        }
    }
}
function findBomb(clicked){
    clicked = 'b'+clicked
    for(bomb of bombsPosition){
        if (clicked === bomb){
            return true
        }
    }
}
function game(clicked, element) {
    if (findFlag(clicked)){
    }
    else if (findBomb(clicked)){
        element.style.backgroundImage = "url('assets/images/icons/explosion.png')"
        element.style.backgroundSize = 'cover'
        gameover = true
        return
    }else{
        reveal()
    }

}
function reveal(){

}
function crono(){
    let time = new Date(0)
    clearInterval(cronometro)
    const timer = document.querySelector('.timer')
    const cronometro = setInterval(function(){
        time.setMilliseconds(time.getMilliseconds()+10)
        timer.innerHTML = `${time.toLocaleTimeString('pt-BR',{hour12:false,timeZone:'GMT'}).slice(3)}.${getHundredth(time)}`
    }, 10)
}
function getHundredth(time){
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
function getDificult(level){
    let tam;
    let bombsQtd;
    const dificult = level[0]
    if (dificult === 'INICIANTE'){
        tam = 8
        bombsQtd = 10
    }else if(dificult === 'INTERMEDIARIO'){
        tam = 16
        bombsQtd = 40
    }else{
        tam = 32
        bombsQtd = 100
    }
    return [tam,bombsQtd]
}
function randomNum(floor){
    return (Math.random()*floor).toFixed(0)
}
function generateField(dificult){
    const field = document.querySelector('.field')
    field.innerHTML = ''
    for(let i=0;i<dificult;i++){
        let tr = document.createElement('tr')
        tr.classList.add(`.c${i}`)
        for(let j=0;j<dificult;j++){
            let td = document.createElement('td')
            td.classList.add(`.c${j}`)
            let button = document.createElement('button')
            button.innerText = '|'
            td.appendChild(button)
            tr.appendChild(td)
        }
        field.appendChild(tr)
    }
}