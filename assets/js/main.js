import * as crono from "./crono.js";
import {square as square} from "./square.js";

let minesWeeper = []
const level = ['EXPERTE','INICIANTE', 'INTERMEDIARIO']
let squares;
let firstClick = true
let gameover = false
let bombnumber = 0



document.addEventListener("click", click)
document.addEventListener("contextmenu", event => {
    const element = event.target
    
    if(element.innerText === 'O'||element.innerText === '?') {
        event.preventDefault()
        rightClick(element)
    }
});

function click(event){
    const element = event.target
    const configs = getDificult(level)
    let clicked

    const button = {
        START: function(){
            start(configs)
        },
        DIFICULT: function(){
            dificult(level)
        },
        INICIANTE: function(){
            dificult(level)
        },
        INTERMEDIARIO: function(){
            dificult(level)
        },
        EXPERTE: function(){
            dificult(level)
        },
        O: function(){
            
            clicked = clickField(element)
            if(!isNaN(clicked[0] && !isNaN(clicked[1]))){
                if(firstClick){
                    try{
                        armBombs(configs, clicked)
                        firstClick = false
                        crono.cronoStart()
                    }catch(error){
                        firstClick = true
                        console.log(error)
                    }
                }
                if(!gameover){
                    game(clicked, configs[0])
                }
            }
        }
    }
    if(button[element.innerText]){
        const func = button[element.innerText]
        func()
    }
    if (!firstClick && !gameover){
        if (squares-configs[1] === 0){
            win()
        } 
    }
}
function rightClick(element){
    if (!gameover){
        let clicked = clickField(element)
        let position = minesWeeper[clicked[0]][clicked[1]]
        if(position.element.innerText === '?'){
            position.blank()
        }else if(position.flag){
            bombnumber++
            position.question()
        }
        else{
            bombnumber--
            position.putFlag()
        }
        defineText('.bomb-qtd', bombnumber)
    }
}
function start(configs){
    crono.cronoZero()
    defineText('.result', '')
    generateField(configs[0])
    firstClick = true
    squares = configs[0]*configs[0]
    bombnumber = configs[1]
    defineText('.bomb-qtd', bombnumber)
    gameover = false
}
function dificult(level){
    let aux = level.shift()
    defineText('.dificult', level[0])
    level.push(aux)
}
function around(position, clicked){
    let [x1, y1] = clicked
    let [x2, y2] = position

    x2 = Number(x2)
    y2 = Number(y2)

    let h = []
    
    for(let i = -1;i < 2; i++){
        for(let j = -1;j < 2;j++){
            if(x2===(x1+i)&& y2===(y1+j)){
                return true
            }
        }
    }
    return false    
}
function armBombs(dificult, clicked){
    let [tam, bombQtd] = dificult
    let i = 0;
    
    while(i < bombQtd){
        let y = randomNum(tam)
        let x = randomNum(tam)
        
        let square = minesWeeper[x][y]
        
        if (square.bomb || around([x,y], clicked)){
            continue
        }else{
            square.putBomb()
            i++
        }
    }
}
function clickField(element){
    let parent = element.parentNode
    let grandfather = parent.parentNode
    let line, column;
    
    line = parent.classList.value.slice(1)
    column = grandfather.classList.value.slice(1)

    let clicked = [Number(column),Number(line)]

    return clicked
}
function game(clicked,tam) {
    let [x,y] = clicked
    let square = minesWeeper[x][y]
    if(square.bomb){
        gameOver(clicked, square)
        return
    }
    reveal(clicked, tam, square)
}
function reveal(clicked, tam, square){
    let [x,y] = clicked
    let position;
    let bombNum = 0
    
    if(square.open || square.bomb || square.flag){
        return true
    }
    squares = square.click(squares)
    
    for(let i = -1;i < 2; i++){
        for(let j = -1;j < 2;j++){
            
            if(x + i < tam && x + i >= 0 && y + j < tam && y + j >= 0){
                position = minesWeeper[x + i][y + j]
                if(position.bomb){
                    bombNum += 1
                }
            }
        }
    }
    square.bombQtd = bombNum
    square.putColor()
    if (bombNum === 0){
        rereveal(x,y,tam)
    }
}
function rereveal(x,y,tam){
    let position
    for(let i = -1;i < 2; i++){
        for(let j = -1;j < 2;j++){
            if(x + i < tam && x + i >= 0 && y + j < tam && y + j >= 0){
                position = minesWeeper[x + i][y + j]
                reveal([x + i, y + j], tam, position)
            }
        }
    }
}
function gameOver(clicked, square){
    gameover = true
    crono.cronoStop(gameover)
    let explosion = new Audio('/assets/sounds/NenadSimic - Muffled Distant Explosion.wav')
    square.boom()
    explosion.play()
    defineText('.result','Você perdeu')
    endReveal(clicked)
}
function win(){
    crono.cronoStop(gameover)
    let winBell = new Audio('/assets/sounds/hjm-glass_bell_1.wav')
    winBell.play()
    defineText('.result','Você ganhou')
    defineText('.bomb-qtd', 0)
    gameover = true
    
}
function endReveal(clicked){
    let time = 1
    for(let i in minesWeeper){
        for(let j in minesWeeper[i]){
            time++
            let position = minesWeeper[i][j]
            if((Number(i) !== clicked[0] || Number(j) !== clicked[1]) && position.bomb && !position.flag){
                setTimeout(function(){
                    position.revealBomb()
                }, 25*time)
            }
        }
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
        tam = 16
        bombsQtd = 100
    }
    return [tam,bombsQtd]
}
function randomNum(floor){
    floor -= 1
    return (Math.random()*floor).toFixed(0)
}
function generateField(dificult){
    minesWeeper = []
    const field = document.querySelector('.field')
    field.innerHTML = ''

    for(let i=0;i<dificult;i++){
        let tr = document.createElement('tr')
        let line = []
        tr.classList.add(`c${i}`)
        
        for(let j=0;j<dificult;j++){
            let td = document.createElement('td')
            td.classList.add(`l${j}`)
            let button = document.createElement('button')
            button.innerText = 'O'
            td.appendChild(button)

            tr.appendChild(td)
            line.push(square(button))
        }

        field.appendChild(tr)
        minesWeeper.push(line)
    }
}
function defineText(attribute, content){
    let  tag = document.querySelector(attribute)
    tag.innerText = content
}