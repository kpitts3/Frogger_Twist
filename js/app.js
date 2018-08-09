function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

var gameStatus = 0; 

var Enemy = function() {
    this.sprite = ['images/smurfShip.png', 'images/gameOver.png'];
    this.cross = [108, 191, 274, 357];
    this.startCross = getRandom(0, 4);
    this.y = this.cross[this.startCross];
    this.x = -102;
    this.speed = getRandom(100, 200);
    this.right = this.x + 96;
    this.lane = this.y + 36; 
};

Enemy.prototype.update = function(dt) {
    this.x = this.x + (this.speed + (returns * 75)) * dt;
    this.right = this.x + 96;
    if (this.x > 606) {
        var index = allEnemies.indexOf(this);
        allEnemies.splice(index, 1);
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite[gameStatus]), this.x, this.y);
};

var allEnemies = [];

function newEnemies() {
    var enemy = new Enemy();
    allEnemies.push(enemy);
};

var spawnInterval = setInterval(newEnemies, 900);

var Player = function() {
    this.direction = 0; 
    this.sprite = [ "images/frogShipUp.png", "images/frogShipDn.png" ];
    this.x = 286;
    this.y = 425;
    this.lane = this.y + 51;
};


Player.prototype.update = function() {
    if (this.y >= 425) this.direction = 0; else if (this.y <= 11) this.direction = 1;
    this.lane = this.y + 51;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite[this.direction]), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    if ("up" === key) {
        if (this.y - 83 >= -15) {
            this.y -= 83;
            this.direction = 0;
        }
    } else if ("down" === key) {
        if (this.y + 83 <= 425) {
            this.y += 83;
            this.direction = 1;
        }
    } else if ("right" === key) {
        if (this.x + 86 <= 606) {
            this.x += 86;
        }
    } else if ("left" === key) 
        if (this.x - 86 >= -2){ 
            this.x -= 86;
        }
};

var player = new Player();
document.addEventListener("keyup", function(a) {
    var keys = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };
    player.handleInput(keys[a.keyCode]);
});

var BonusItem = function() {
    this.imgCount = 0;
}

BonusItem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite[this.imgCount]), this.x, this.y);
}

BonusItem.prototype.update = function(calls) {
    if (calls % 10 === 0) {
        this.imgCount++;
        if (this.imgCount === 8) {
            if (this === boom){
                var index = allItems.indexOf(this);
                allItems.splice(index,1);
                this.imgCount = 0;
            }else{this.imgCount = 0;
            };
        };
    }
}

var Shield = function() {
    BonusItem.call(this);
    this.sprite = [ "images/shield-0.png", "images/shield-1.png", 
        "images/shield-2.png", "images/shield-3.png", "images/shield-0.png", 
        "images/shield-1.png", "images/shield-2.png", "images/shield-3.png"];
    this.row = [ 119, 202, 285, 368 ];
    this.startRow = getRandom(0, 4); 
    this.y = this.row[this.startRow];
    this.col = [ 31, 117, 203, 289, 375, 461, 547 ];
    this.startCol = getRandom(0, 7); 
    this.x = this.col[this.startCol];
    this.lane = this.y + 25;
    this.center = this.x + 27;
}

Shield.prototype = Object.create(BonusItem.prototype);

Shield.prototype.constructor = Shield;

function newShield() {
    var shield = new Shield();
    allItems.push(shield);
};

var ShieldUp = function() {
    BonusItem.call(this);
    this.sprite = 'images/ShipShieldLt.png';
    this.y = 0;
    this.x = 0; 
}
ShieldUp.prototype = Object.create(BonusItem.prototype);

ShieldUp.prototype.constructor = ShieldUp;

ShieldUp.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), player.x - 23, player.y);
}

var shieldUp = new ShieldUp;
var Boom = function() {
    BonusItem.call(this);
    this.sprite = ["images/boom-1.png", "images/boom-2.png",
        "images/boom-3.png", "images/boom-4.png", "images/boom-5.png",
        "images/boom-6.png", "images/boom-7.png", "images/boom-8.png"
    ];
    this.x = 0;
    this.y = 0; 
};

Boom.prototype = Object.create(BonusItem.prototype);

Boom.prototype.constructor = Boom;

var boom = new Boom;
var allItems = [];
var lives = 3,
    kills = 0,
    shields = 0;

function checkCollisions() {
   allEnemies.forEach(function(enemy) {
        if (player.lane === enemy.lane && player.x > enemy.x - 50 && player.x - 23 < enemy.right) {
            if (allItems.indexOf(shieldUp) > -1) {                
                boom.x = enemy.x + 12;
                boom.y = enemy.y;
                allItems.push(boom);
                var enemyIndex = allEnemies.indexOf(enemy);
                allEnemies.splice(enemyIndex, 1);
                kills++;
                var shieldIndex = allItems.indexOf(shieldUp);
                allItems.splice(shieldIndex, 1);
                shields--;
            } else {
                boom.x = player.x - 8;
                boom.y = player.y + 6;
                allItems.push(boom);
                lives--;
                if (lives > 0) {
                    player.x = 286;
                    player.y = 425;
                } else {
                    player.x = -100;
                    player.y = 425;
                    Enemy.x = -506;
                    gameStatus = 1;
                };
            };
        }
    });
    if (allItems.length >= 1) {
        allItems.forEach(function(item) {
            if (player.lane === item.lane && player.x + 30 === item.center) {
                var index = allItems.indexOf(item);
                allItems.splice(index, 1);
                allItems.push(shieldUp);
                shields++;
            };
        });
    }
}
 
var goal = 0,
    returns = 0;

function levelUp() {
    if (61 === player.lane && goal === returns) goal++;
    if (476 === player.lane && goal > returns) {
        returns++; 
        spawnInterval = setInterval(newEnemies, 1e4);
        newShield(); 
    }
}