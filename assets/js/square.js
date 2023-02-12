export function Square(element){
         this.bomb = false
         this.flag = false
         this.open = false
         this.bombQtd = 0
         this.element = element
}
Square.prototype.getBombF = function(){
    return this.bomb
}
Square.prototype.putFlag = function(){
    if(!this.open){
        if(!this.flag){
            this.flag = true
            this.backgroundImg(this.flagImg)
        }
    }
}
Square.prototype.removeFlag = function(){
   if(!this.open){
       this.flag = false
       this.element.style.backgroundImage = ''
   }
}
Square.prototype.putBomb = function(){
    this.bomb = true
}
Square.prototype.revealBomb = function(){
    if(this.bomb && !this.flag){
        this.backgroundImg(this.bombImg)
    }
}
Square.prototype.putColor = function(){
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
}
Square.prototype.click = function(squares){
    if(this.flag){
        return squares
    }else{
        this.open = true
        squares--
    }
    return squares
}
Square.prototype.boom = function(){
   this.backgroundImg(this.explosionImg)
   this.flag = true
}
Square.prototype.question = function(){
   this.removeFlag()
   this.flag = true
   this.element.classList.add('question')
   this.element.innerText = '?'
}
Square.prototype.blank = function(){
   this.flag = false
   this.element.innerText = 'O'
   this.element.classList.remove('question')
}
Square.prototype.backgroundImg = function(img){
   this.element.style.backgroundImage = img
   this.element.style.backgroundRepeat = 'no-repeat'
   this.element.style.backgroundSize = '80%'
   this.element.style.backgroundPosition = 'center'
}

Square.prototype.flagImg = "url('assets/images/icons/flag.png')"
Square.prototype.bombImg = "url('assets/images/icons/bomb.png')"
Square.prototype.explosionImg = "url('assets/images/icons/explosion.png')"