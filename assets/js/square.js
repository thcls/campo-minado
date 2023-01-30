export function square(element){
    const flagImg = "url('assets/images/icons/flag.png')"
    const bombImg = "url('assets/images/icons/bomb.png')"
    const explosionImg = "url('assets/images/icons/explosion.png')"
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
                 if(!this.flag){
                     this.flag = true
                     this.element.style.backgroundImage = flagImg
                     this.element.style.backgroundSize = 'cover'
                 }
             }
         },
         removeFlag(){
            if(!this.open){
                this.flag = false
                this.element.style.backgroundImage = ''
            }
         },
         putBomb(){
             this.bomb = true
         },
         revealBomb(){
             if(this.bomb && !this.flag){
                 this.element.style.backgroundImage = bombImg
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
             this.element.style.backgroundImage = explosionImg
             this.element.style.backgroundSize = 'cover'
         },
     };
     return squar
}
