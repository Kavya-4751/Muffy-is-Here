class Player{
    constructor(){
        this.position = {
            x: 100,
            y: 100,
        }

        this.velocity = {
            x: 0,
            y: 0,
        }

        this.width = 100;
        this.height = 100;
        this.sides = {
            bottom: this.position.y + this.height
        }
        this.gravity = 1;
        this.image = new Image();
        this.image.src = './img/muffy.png';
    }
    draw(){
        // draw player using muffy.png when it's loaded
        if (this.image && this.image.complete && this.image.naturalWidth !== 0) {
            //c.clearRect(this.position.x, this.position.y, this.width, this.height);
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.sides.bottom = this.position.y + this.height+50; 
        
        //above the ground
        if (this.sides.bottom  +this.velocity.y < canvas.height) {
         this.velocity.y += this.gravity;
        } else this.velocity.y = 0;

    }
}