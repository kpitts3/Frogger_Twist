var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        calls=0,
        lastTime;

    canvas.width = 606;
    canvas.height = 600;
    ctx.fillStyle = "#00FF00";
    ctx.font="10px Orbitron";    

    doc.body.appendChild(canvas);

    function main() {

        calls++;
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        update(dt,calls);
        render();

        lastTime = now;
        win.requestAnimationFrame(main);
    };

    function init() {
        lastTime = Date.now();
        main();
    }

    function update(dt,calls) {
        updateEntities(dt,calls);
        checkCollisions();
        levelUp();
    }

    function updateEntities(dt,calls) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        allItems.forEach(function(item) {
            item.update(calls);
        });
    }

    function render() {
        ctx.drawImage(Resources.get('images/spaceBackground4.png'),0,0);
        ctx.font="10px Orbitron";    
        ctx.fillText("level",272,565);
        ctx.fillText("lives",328,565);
        ctx.fillText("shields",378,565);
        ctx.fillText("kills",442,565);
        ctx.font="20px Orbitron";    
        ctx.fillText(returns+1,272,585);
        ctx.fillText(lives,332,585);
        ctx.fillText(shields,388,585);
        ctx.fillText(kills,442,585);
        renderEntities();
    }

    function renderEntities() {

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        allItems.forEach(function(item) {
            item.render();
        });
        player.render();        
    }

    Resources.load([
        'images/smurfShip.png', 'images/gameOver.png', // Serenity and Reaver ships
        'images/frogShipUp.png', 'images/frogShipDn.png', // belong to Joss Whedon's Firefly
        'images/ShipShieldLt.png',
        'images/spaceBackground4.png',
        'images/shield-0.png', 'images/shield-1.png', //by Niantic Labs. Copyright 2015
        'images/shield-2.png', 'images/shield-3.png', 
        'images/strike-1.png', 'images/strike-2.png', //by Niantic Labs. Copyright 2015
        'images/strike-3.png', 'images/strike-4.png', 
        'images/strike-5.png', 'images/strike-6.png', 
        'images/strike-7.png', 'images/strike-8.png', 
        'images/boom-1.png', 'images/boom-2.png',
        'images/boom-3.png', 'images/boom-4.png',
        'images/boom-5.png', 'images/boom-6.png',
        'images/boom-7.png', 'images/boom-8.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);