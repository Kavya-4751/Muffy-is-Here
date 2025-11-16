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
    d: { pressed: false },
    space: { pressed: false }
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
    y: 400,
    width: 550,
    height: 300
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

// Store original draw methods for backgrounds
const originalDrawMethods = new Map();
originalDrawMethods.set(backgroundKitchen, backgroundKitchen.draw.bind(backgroundKitchen));
originalDrawMethods.set(backgroundBedroom, backgroundBedroom.draw.bind(backgroundBedroom));

// Generic function to override draw method to include bone
function overrideDrawWithBone(background) {
    background.draw = function() {
        originalDrawMethods.get(background)();
        if (boneActive && bone) bone.draw();
    };
}

// Restore original draw method
function restoreOriginalDraw(background) {
    background.draw = originalDrawMethods.get(background);
}

function spawnBone(posx, posy, background) {
    bone = new Sprite({
        position: { x: posx, y: posy },
        imageSrc: './img/bone.png'
    });
    boneActive = true;
    overrideDrawWithBone(background);
}

function removeBone(background) {
    boneActive = false;
    restoreOriginalDraw(background);
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
    
c.fillStyle = "white";
c.font = "30px Arial";
c.textAlign = "center";

if (currentLevel === 1) {
    c.fillText("Living Room", canvas.width / 2, 50);
}

if (currentLevel === 2) {
    if (boneActive) {
        c.fillText("Go collect the bone!", canvas.width / 2, 50);
    } else {
        c.fillText("Yay! Let's go to the bedroom.", canvas.width / 2, 50);
    }
}

if (currentLevel === 3) {
    c.fillText("Bedroom — Press enter to drop the bone", canvas.width / 2, 50);
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
        spawnBone(600, 300, backgroundKitchen);
    }

    // Remove bone if player collides with boneBox in kitchen
    if (currentLevel === 2 && boneActive && isColliding(player, boneBox)) {
        removeBone(backgroundKitchen);
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

        // Only drop the bone and override draw once when Enter is pressed and bone is not already active
        if (keys.space.pressed && !boneActive) {
            spawnBone(700, 300, backgroundBedroom);
            c.fillText("Yay! your best friend is happy now.", canvas.width / 2, 50);
        } 
    }

}
animate()



