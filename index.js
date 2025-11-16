const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;


let currentLevel = 1;

const backgroundLivingRoom = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './img/livingRoom.png'
});

const backgroundKitchen = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './img/kitchen.png'
});

const backgroundBedroom = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './img/bedroom.png'
});

const player = new Player();


const keys = {
    w: { pressed: false },
    a: { pressed: false },
    d: { pressed: false }
};



const livingRoomDoor = {
    x: 1000,
    y: 300,
    width: 80,
    height: 150
};

const boneBox = {
    x: 600,
    y: 300,
    width: 50,
    height: 50
};

const kitchenDoor = {
    x: 50,
    y: 300,
    width: 80,
    height: 150
};
const bedBox = {
    x: 700,
    y: 300,
    width: 550,
    height: 800
};

function isColliding(player, box) {
    return (
        player.position.x < box.x + box.width &&
        player.position.x + player.width > box.x &&
        player.position.y < box.y + box.height &&
        player.position.y + player.height > box.y
    );
}


let bone = null;
let boneActive = false;
let _origKitchenDraw = backgroundKitchen.draw.bind(backgroundKitchen);

function spawnBone(posx, posy) {
    bone = new Sprite({
        position: { x: posx, y: posy },
        imageSrc: './img/bone.png'
    });
    boneActive = true;
    backgroundKitchen.draw = function() {
        _origKitchenDraw();
        if (boneActive && bone) bone.draw();
    };
}

function removeBone() {
    boneActive = false;
    backgroundKitchen.draw = _origKitchenDraw;
}

function animate() {
    window.requestAnimationFrame(animate);

    // Draw background based on level
    if (currentLevel === 1) {
        backgroundLivingRoom.draw();
    } else if (currentLevel === 2) {
        backgroundKitchen.draw();       
    }
    else if (currentLevel === 3) {
        backgroundBedroom.draw();       
    }
    

    player.velocity.x = 0;
    if (keys.d.pressed) player.velocity.x = 5;
    else if (keys.a.pressed) player.velocity.x = -5;

    // Draw + update player
    player.draw();
    player.update();

    if (currentLevel === 1 && isColliding(player, livingRoomDoor)) {
        currentLevel = 2;

        // teleport player inside kitchen
        player.position.x = 75;
        player.position.y = 450;

        // spawn bone and set up kitchen draw
        spawnBone(600,300);
    }

    // Remove bone if player collides with boneBox in kitchen
    if (currentLevel === 2 && boneActive && isColliding(player, boneBox)) {
        removeBone();
    }

    if (currentLevel === 2 && boneActive === false && isColliding(player, livingRoomDoor)) {
        currentLevel = 3;
        player.position.x = 75;
        player.position.y = 450;
    } else if (currentLevel === 2 && boneActive === true && isColliding(player, livingRoomDoor)) {
        // prevent exiting the kitchen while the bone is still active:
        // block the player at the door and stop horizontal movement
        player.position.x = livingRoomDoor.x - player.width - 1;
        player.velocity.x = 0;
    }

    if (currentLevel === 3 && isColliding(player, bedBox)){
        player.velocity.x = 0;
        player.velocity.y = 0;
        spawnBone(850,350);
    } 
}

animate()



