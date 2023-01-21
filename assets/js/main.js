document.addEventListener("mousedown", click)
document.addEventListener("contextmenu", e => e.preventDefault());
let minesweeper = []
const level = ['EXPERTE','INICIANTE', 'INTERMEDIARIO']
let bombs = 0;
let squares;
let firstClick = true
let gameover = false
let cronometro
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
        putFlag(bombs){
            if(!this.open){
                if(!this.flag){
                    this.flag = true
                    this.element.style.backgroundImage = "url('assets/images/icons/flag.png')"
                    this.element.style.backgroundSize = 'cover'
                    if(this.bomb){
                        bombs--
                    }
                }else{
                    this.removeFlag()
                    if(this.bomb){
                        bombs++
                    }
                }
            }
            console.log(bombs)
            return bombs
        },
        removeFlag(){
            this.flag = false
            this.element.style.backgroundImage = ''
        },
        putBomb(){
            this.bomb = true
        },
        revealBomb(){
            if(this.bomb && !this.flag){
                this.element.style.backgroundImage = "url('assets/images/icons/bomb.png')"
                this.element.style.backgroundSize = 'cover'
            }
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
        click(squares){
            if(this.flag){
                return squares
            }else if(this.bomb){
                this.boom()
                return false
            }else{
                this.open = true
                squares--
            }
            return squares
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
    let configs = getDificult(level)
    let clicked
    if (element.innerText === 'START') {
        clearInterval(cronometro)
        const result = document.querySelector('.result')
        result.innerText = ''
        const timer = document.querySelector('.timer')
        timer.innerHTML = '00:00.00'
        generateField(configs[0])
        firstClick = true
        squares = configs[0]*configs[0]
        bombs = configs[1]
        gameover = false
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
        clicked = clickField(element)
        let position = minesweeper[clicked[0]][clicked[1]]
        bombs = position.putFlag(bombs)
    }
    else if(element.innerText === 'O'){
        clicked = clickField(element)
        
        if(firstClick){
            try{
                armBombs(configs, clicked)
                firstClick = false
            }catch(error){
                firstClick = true
                console.log(error)
            }finally{
                crono()
            }
        }
        try{
            game(clicked, configs[0])
        }catch{
            
        }
    }
    if(gameover){
        clearInterval(cronometro)
        endReveal(clicked)
    }
    else if (bombs === 0||squares-configs[1] === 0||squares===0){
        clearInterval(cronometro)
        endReveal(clicked)
        win()
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
    if(square.bomb){
        gameover = true
        square.boom()
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
    const result = document.querySelector('.result')
    result.innerText = 'Você perdeu'
}
function win(){
    const result = document.querySelector('.result')
    result.innerText = 'Você ganhou'
}
function endReveal(clicked){
    let time = 1
    for(let i in minesweeper){
        for(let j in minesweeper[i]){
            console.log(clicked,i,j)
            time++
            let position = minesweeper[i][j]
            if((Number(i) !== clicked[0] || Number(j) !== clicked[1]) && position.bomb && !position.flag){
                setTimeout(function(){
                    position.revealBomb()
                }, 50*time)
            }
        }
    }
}
function crono(){
    let time = new Date(0)
    clearInterval(cronometro)
    const timer = document.querySelector('.timer')
    cronometro = setInterval(function(){
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
