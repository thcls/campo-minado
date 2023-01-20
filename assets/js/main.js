document.addEventListener("mousedown", click)
let minesweeper = []
const level = ['EXPERTE','INICIANTE', 'INTERMEDIARIO']
let firstClick = true
let gameover = false
function square(element){
   const squar = {
        bomb: false,
        flag: false,
        open: false,
        bombQtd: 0,
        element: element,
        get bombF(){
            return this.bomb
        },
        putFlag(){
            if(!this.open){
                this.flag = true
                this.element.style.backgroundImage = "url('assets/images/icons/flag.png')"
                this.element.style.backgroundSize = 'cover'
            }
        },
        removeFlag(){
            this.flag = false
            this.element.style.backgroundImage = 'O'
        },
        putBomb(){
            this.bomb = true
        },
        revealBomb(){
            this.element.style.backgroundImage = "url('assets/images/icons/bomb.png')"
            this.element.style.backgroundSize = 'cover'
        },
        putColor(){
            this.element.innerText = this.bombQtd
            
            switch(this.bombQtd){
                case 0:
                    this.element.classList.add('zero')
                    break
                case 1:
                    this.element.classList.add('one')
                    break
                case 2:
                    this.element.classList.add('two')
                    break
                case 3:
                    this.element.classList.add('three')
                    break
                case 4:
                    this.element.classList.add('four')
                    break
                case 5:
                    this.element.classList.add('five')
                    break
                case 6:
                    this.element.classList.add('six')
                    break
                case 7:
                    this.element.classList.add('seven')
                    break
                case 8:
                    this.element.classList.add('eight')
                    break
            }
        },
        click(){
            if(this.flag){
                return false
            }else if(this.bomb){
                this.boom()
                return true
            }else{
                this.open = true
                return false
            }
        },
        boom(){
            this.element.style.backgroundImage = "url('assets/images/icons/explosion.png')"
            this.element.style.backgroundSize = 'cover'
        },
    };
    return squar
}
function click(event){
    let element = event.target
    
    if (element.innerText === 'START') {
        let configs = getDificult(level)
        generateField(configs[0])
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
    else if(element.innerText === 'O' && event.buttons === 2){
        let clicked = clickField(element)
        putFlag(clicked, element)
    }
    else if(element.innerText === 'O'){
        let clicked = clickField(element)
        let configs = getDificult(level)
        console.log(firstClick)
        if(firstClick){
            try{
                armBombs(getDificult(level), clicked)
                firstClick = false
            }catch(error){
                firstClick = true
                console.log(error)
            }
        }
        try{
            game(clicked, configs[0])
        }catch{
            
        }
    }
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
        
        let square = minesweeper[x][y]
        
        if (square.bomb || around([x,y], clicked)){
            continue
        }else{
            square.putBomb()
            square.revealBomb()
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
    let square = minesweeper[x][y]
    reveal(clicked, tam, square)
    if (gameover){
        gameOver()
    }
}
function reveal(clicked, tam, square){
    let [x,y] = clicked
    let position;
    let bombNum = 0
    if(square.open || square.bomb){
        
        return true
    }
    square.click()
    
    for(let i = -1;i < 2; i++){
        for(let j = -1;j < 2;j++){
            
            if(x + i < tam && x + i >= 0 && y + j < tam && y + j >= 0){
                position = minesweeper[x + i][y + j]
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
                position = minesweeper[x + i][y + j]
                reveal([x + i, y + j], tam, position)
            }
        }
    }
}
function gameOver(){
    const field = document.querySelector('.field')
    field.innerHTML = ''
}
function endReveal(){

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
    floor -= 1
    return (Math.random()*floor).toFixed(0)
}
function generateField(dificult){
    const field = document.querySelector('.field')
    field.innerHTML = ''

    minesweeper = []

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
        minesweeper.push(line)
    }
}
