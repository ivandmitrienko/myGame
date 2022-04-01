// CANVAS
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");
cvs.style.border = "1px solid #0ff";
cvs.style.marginBottom = '10px'
ctx.lineWidth = 3;
let SCORE = 0;

window.addEventListener("resize", InitApp); //При растягивании окна приложение будет инициализироваться заново

function InitApp() { //RESIZE CANVAS
    if(window.innerWidth >= 1920) {

        cvs.width = window.innerWidth*0.27;
        cvs.height = window.innerHeight*0.61;
    } else if (window.innerWidth < 768) {
        cvs.width = window.innerWidth * 0.95;
        cvs.height = window.innerHeight * 0.8;

    }
    
    // GAME VARIABLES AND CONSTANTS
    const PADDLE_WIDTH = cvs.width/5;
    const PADDLE_MARGIN_BOTTOM = cvs.width/10;
    const PADDLE_HEIGHT = cvs.width/25;
    let score_paddle = 20; // how many points you need to score for the next increase in the width of the platform
    const BALL_RADIUS = cvs.width/62.5;
    let LIFE = 3; // PLAYER HAS 3 LIVES
    const SCORE_LIFE = 3; //3
    // let SCORE = 0;
    const SCORE_UNIT = 10;
    let LEVEL = 1;
    const MAX_LEVEL = 3; //3
    let GAME_OVER = false;
    let leftArrow = false;
    let rightArrow = false;
    let controlGame = 0;
    let request = "Click the play button in the lower right corner";
    let touchStart = null; //first touch
    let touchPosition = null; //curent touch position 
    let sensitivity = 70; // Sensitivity - the number of manifestations after which the gesture will be considered a swipe
    // swipe variables
    let y1 = null; 
    let y2 = null;
    //for ajax
    // let ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
    // let messages; // ELEMENT OF ARRAY - {name:'Иванов',score:'101'};
    // let updatePassword;
    // let stringName='DMITRY_AR_RECORDS';
    // let name;

    // CREATE THE PADDLE
    let paddle = {
        x : cvs.width/2 - PADDLE_WIDTH/2,
        y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
        width : PADDLE_WIDTH,
        height : PADDLE_HEIGHT,
        dx :5
    }
    
    // DRAW PADDLE
    function drawPaddle(){
        ctx.fillStyle = "#2e3548";
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        
        ctx.strokeStyle = "#ffcd05";
        ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    // SELECT PAUSE ELEMENT
    
    let pauseElement = document.getElementById('pause');

    pauseElement.addEventListener("click", switchImgPause);

    pauseElement.addEventListener("touchstart", switchImgPause);

    function switchImgPause(){

        let pauseSrc = pauseElement.getAttribute('src');
        if(pauseSrc == './img/play.png') {
            pauseElement.setAttribute("src", "./img/pause.png");
            controlGame = 1;
        } else {
            pauseElement.setAttribute("src", "./img/play.png");
            controlGame = 0;
        }

    }
    
    
    // CONTROL THE PADDLE AND PUSH BALL
    
    document.addEventListener("keydown", function(EO){
       EO = EO || window.event;
       EO.preventDefault();
       if(EO.keyCode == 37){
           leftArrow = true;
       }else if(EO.keyCode == 39){
           rightArrow = true;
       }
    });
    document.addEventListener("keyup", function(EO){
       EO = EO || window.event;
       EO.preventDefault();
       if(EO.keyCode == 37){
           leftArrow = false;
       }else if(EO.keyCode == 39){
           rightArrow = false;
        }
    
    });
    
    cvs.addEventListener("mousemove", function(EO){
        EO = EO || window.event;
        EO.preventDefault();
        if(controlGame) {
            let relativeX = EO.clientX - cvs.getBoundingClientRect().left;
            if(relativeX > paddle.width/2 && relativeX < cvs.width - paddle.width/2) {
                paddle.x = relativeX - paddle.width/2;
            }
    
        }
        
    });

    cvs.addEventListener("touchstart", function(EO){
        EO = EO || window.event;
        EO.preventDefault();
        if(controlGame)  {

            touchStart = EO.changedTouches[0].clientX - cvs.getBoundingClientRect().left;

            y1 = EO.changedTouches[0].clientY - cvs.getBoundingClientRect().top;

            if( touchStart > paddle.width/2 &&  touchStart < cvs.width - paddle.width/2) {
                touchPosition = touchStart - paddle.width/2;
                paddle.x =  touchPosition;
            }
        }      
    }) 

    cvs.addEventListener("touchmove",function(EO) {
        EO = EO || window.event;
        EO.preventDefault();
        if(controlGame){

            touchPosition = EO.changedTouches[0].clientX - cvs.getBoundingClientRect().left;

            y2 = EO.changedTouches[0].clientY - cvs.getBoundingClientRect().top;
    
            if(touchPosition > paddle.width/2 &&   touchPosition < cvs.width - paddle.width/2) {
                paddle.x = touchPosition - paddle.width/2;
            }    
        }   
    })

    window.addEventListener("touchend",function(EO) {
        EO = EO || window.event;
        EO.preventDefault();

        checkAction(); //Determine which gesture the user made (swipe)

        touchStart = null;
        touchPosition = null;
    })


    function checkAction() {

        let checkSwipe = y1 - y2;

        if(Math.abs(checkSwipe) > sensitivity) {
            if(checkSwipe > 0) { 
              location.reload(); //exit
            } 
        }

    }
    
    
    // MOVE PADDLE
    function movePaddle(){
        if(controlGame) {
            if(rightArrow && paddle.x + paddle.width < cvs.width){
                paddle.x += paddle.dx;
            }else if(leftArrow && paddle.x > 0){
                paddle.x -= paddle.dx;
            }
        }   
    }
    
    // CREATE THE BALL
    let ball = {
        x : cvs.width/2,
        y : paddle.y - BALL_RADIUS,
        radius : BALL_RADIUS,
        speed : 4,
        dx : 3 * (Math.random() * 2 - 1),
        dy : -3
    }
    
    // DRAW THE BALL
    function drawBall(){
        ctx.beginPath();
        
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
        ctx.fillStyle = "#ffcd05";
        ctx.fill();
        
        ctx.strokeStyle = "#2e3548";
        ctx.stroke();
        
        ctx.closePath();
    }
    
    // MOVE THE BALL
    function moveBall(){
        if(controlGame) {
            ball.x += ball.dx;
            ball.y += ball.dy;
        }    
    }
    
    // BALL AND WALL COLLISION DETECTION
    function ballWallCollision(){
        if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0){
            ball.dx = - ball.dx;
            if(controlGame){
                WALL_HIT.play();
            }
            
        }
        
        if(ball.y - ball.radius < 0){
            ball.dy = -ball.dy;
            if(controlGame){
                WALL_HIT.play();
            }     
        }
        
        if(ball.y + ball.radius > cvs.height){
            LIFE--; // LOSE LIFE
            if(controlGame) {
                LIFE_LOST.play();
            } 
            resetBall();
        }
    }
    
    // RESET THE BALL AND PADDLE
    function resetBall(){
        ball.x = cvs.width/2;
        ball.y = paddle.y - BALL_RADIUS;
        paddle.x = cvs.width/2 - PADDLE_WIDTH/2;
        paddle.y = cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT;
        ball.dx = 3 * (Math.random() * 2 - 1);
        ball.dy = -3;
    }
    
    // BALL AND PADDLE COLLISION
    function ballPaddleCollision(){
        if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
            
            // PLAY SOUND
            if(controlGame) {
                PADDLE_HIT.play();
            }
       
            // CHECK WHERE THE BALL HIT THE PADDLE
            let collidePoint = ball.x - (paddle.x + paddle.width/2);
            
            // NORMALIZE THE VALUES
            collidePoint = collidePoint / (paddle.width/2);
            
            // CALCULATE THE ANGLE OF THE BALL
            let angle = collidePoint * Math.PI/3;
                
                
            ball.dx = ball.speed * Math.sin(angle);
            ball.dy = - ball.speed * Math.cos(angle);
        }
    }
    
    // CREATE THE BRICKS
    const brick = {
        row : 1,
        column : 6,
        width : cvs.width/9.09,
        height : cvs.width/25,
        offSetLeft : cvs.width/20.83,
        offSetTop : cvs.width/25,
        marginTop : cvs.width/12.5,
        fillColor : "#2e3548",
        strokeColor : "#FFF"
    }
    
    let bricks = [];
    
    
    function createBricks(){
        for(let r = 0; r < brick.row; r++){
            bricks[r] = [];
            for(let c = 0; c < brick.column; c++){
                bricks[r][c] = {
                    x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                    y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                    status : true
                }
            }
        }
    }
    
    createBricks();
    
    // draw the bricks
    function drawBricks(){
        for(let r = 0; r < brick.row; r++){
            for(let c = 0; c < brick.column; c++){
                let b = bricks[r][c];
                // if the brick isn't broken
                if(b.status){
                    ctx.fillStyle = brick.fillColor;
                    ctx.fillRect(b.x, b.y, brick.width, brick.height);
                    
                    ctx.strokeStyle = brick.strokeColor;
                    ctx.strokeRect(b.x, b.y, brick.width, brick.height);
                }
            }
        }
    }
    
    // ball brick collision
    function ballBrickCollision(){
        for(let r = 0; r < brick.row; r++){
            for(let c = 0; c < brick.column; c++){
                let b = bricks[r][c];
                // if the brick isn't broken
                if(b.status){
                    if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                        if(controlGame){
                            BRICK_HIT.play();
                        }  
                        ball.speed += 0.5; //move ball faster
                        ball.dy = - ball.dy;
                        b.status = false; // the brick is broken
                        SCORE += SCORE_UNIT;
                        if (SCORE > score_paddle) {
                            paddle.width += 10;
                            score_paddle += 30; // the next increase is after 30 points
                          }
                    }
                }
            }
        }
    }
    
    // show game stats
    function showGameStats(text, textX, textY, img, imgX, imgY){
        // draw text
        ctx.fillStyle = "#FFF";
        ctx.font = "25px Germania One";
        ctx.fillText(text, textX, textY);
        
        // draw image
        ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
    }
    
    // DRAW FUNCTION
    function draw(){
    
        drawPaddle();
        
        drawBall();
        
        drawBricks();
        
        // SHOW SCORE
        showGameStats(SCORE, 35, 30, SCORE_IMG, 5, 10);
        // SHOW LIVES
        showGameStats(LIFE, cvs.width - 25, 30, LIFE_IMG, cvs.width-55, 10); 
        // SHOW LEVEL
        showGameStats(LEVEL, cvs.width/2, 30, LEVEL_IMG, cvs.width/2 - 30, 5);
    
    
        if(!controlGame){
            showRequestStats();
        } 
        
         
    }
    
    //  SHOW REQUEST
     function showRequestStats(){ 
            
        if(window.innerWidth >= 480) {
            ctx.font = "20px Germania One";
        }
        else if(window.innerWidth < 480){
            ctx.font = "10px Germania One";
        }
        ctx.fillStyle = "#FFF";
        if(window.innerWidth < 768) {
            ctx.fillText(request, cvs.width/4, cvs.height/2);
        } else {
            ctx.fillText(request, cvs.width/7, cvs.height/2);
        }
           
    }
    
    
    
    // game over
    function gameOver(){
        if(LIFE <= 0 && controlGame){
            showYouLose();
            GAME_OVER = true;
        }
    }
    
    // level up
    function levelUp(){
        let isLevelDone = true;
        
        // check if all the bricks are broken
        for(let r = 0; r < brick.row; r++){
            for(let c = 0; c < brick.column; c++){
                isLevelDone = isLevelDone && ! bricks[r][c].status;
            }
        }
        
        if(isLevelDone){
            if(controlGame) {
                WIN.play();
            }
            
            
            if(LEVEL >= MAX_LEVEL){
                showYouWin();
                GAME_OVER = true;
                return;
            }
            brick.row++;
            createBricks();
            ball.speed += 0.5;
            resetBall();
            LEVEL++;
            ball.speed = 4;
            paddle.width = 100;
        }
    }
    
    // UPDATE GAME FUNCTION
    function update(){
        movePaddle();
        
        moveBall();
        
        ballWallCollision();
        
        ballPaddleCollision();
        
        ballBrickCollision();
        
        gameOver();
        
        levelUp();
    }
    
    // GAME LOOP
    function loop(){
        // CLEAR THE CANVAS
    
        ctx.drawImage(BG_IMG, 0, 0);
    
        draw();
        
        update();
        
        if(! GAME_OVER){
            requestAnimationFrame(loop);
        }
    }
    loop();
    
    
    // SELECT SOUND ELEMENT
    const soundElement  = document.getElementById("sound");
    
    soundElement.addEventListener("click", audioManager);
    soundElement.addEventListener("touchstart", audioManager);
    
    function audioManager(){
        // CHANGE IMAGE SOUND_ON/OFF
        let imgSrc = soundElement.getAttribute("src");
        let SOUND_IMG = imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";
        
        soundElement.setAttribute("src", SOUND_IMG);
        
        // MUTE AND UNMUTE SOUNDS
        WALL_HIT.muted = WALL_HIT.muted ? false : true;
        PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
        BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
        WIN.muted = WIN.muted ? false : true;
        LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
    }
    
    // SHOW GAME OVER MESSAGE
    /* SELECT ELEMENTS */
    const gameover = document.getElementById("gameover");
    const youwin = document.getElementById("youwon");
    const youlose = document.getElementById("youlose");
    const restart = document.getElementById("restart");
    
    // CLICK ON PLAY AGAIN BUTTON

    restart.addEventListener("click", reloadGame);

    restart.addEventListener("touchstart", reloadGame);

    function reloadGame () {
        location.reload(); // reload game
    }
    
    // SHOW YOU WIN
    function showYouWin(){
        gameover.style.display = "block";
        youwin.style.display = "block";
    }
    
    // SHOW YOU LOSE
    function showYouLose(){
        gameover.style.display = "block";
        youlose.style.display = "block";
       
        if(SCORE > 10) {
            sendMessage();
            
        }      
    }
   

}

InitApp();



    let ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
    let messages; // ELEMENT OF ARRAY - {name:'Иванов',score:'101'};
    let updatePassword;
    let stringName='DMITRYIENKO_ARKANOID_RECORDS';
    

        
    function showMessages() {
        let str='';
        for ( let m=0; m<messages.length; m++ ) {
            let message=messages[m];
            str+="<b>"+escapeHTML(message.name)+":</b> "
                +escapeHTML(message.score)+"<br />";
        }
        document.getElementById('allRecords').innerHTML=str;
    }
    
    function escapeHTML(text) {
        if ( !text )
            return text;
        text=text.toString()
            .split("&").join("&amp;")
            .split("<").join("&lt;")
            .split(">").join("&gt;")
            .split('"').join("&quot;")
            .split("'").join("&#039;");
        return text;
    }
    
    function refreshMessages() {
        $.ajax( {
                url : ajaxHandlerScript,
                type : 'POST', dataType:'json',
                data : { f : 'READ', n : stringName },
                cache : false,
                success : readReady,
                error : errorHandler
            }
        );

        showMessages()
    }
    
    function readReady(callresult) {
        if ( callresult.error!=undefined )
            alert(callresult.error);
        else {
            messages=[];
            if ( callresult.result!="" ) { 
                messages=JSON.parse(callresult.result);
                if ( !Array.isArray(messages) )
                    messages=[];
            }
            showMessages();
        }
    }
    
    function sendMessage() {
        updatePassword=Math.random();
        $.ajax( {
                url : ajaxHandlerScript,
                type : 'POST', dataType:'json',
                data : { f : 'LOCKGET', n : stringName,
                    p : updatePassword },
                cache : false,
                success : lockGetReady,
                error : errorHandler
            }
        );
    }
    
    function lockGetReady(callresult) {
        if ( callresult.error!=undefined )
            alert(callresult.error);
            else {
                messages=[];
                if ( callresult.result!="" ) { 
                    messages=JSON.parse(callresult.result);
                    if ( !Array.isArray(messages) )
                        messages=[];
                }
                let name = prompt ('ENTER YOUR NAME', );
                messages.push( { name:name, score:SCORE } );
            if ( messages.length>10 )
                messages=messages.slice(messages.length-10);
    
            showMessages();
    
            $.ajax( {
                    url : ajaxHandlerScript,
                    type : 'POST', dataType:'json',
                    data : { f : 'UPDATE', n : stringName,
                        v : JSON.stringify(messages), p : updatePassword },
                    cache : false,
                    success : updateReady,
                    error : errorHandler
                }
            );
        }

    }
    
    function updateReady(callresult) {
        if ( callresult.error!=undefined )
            alert(callresult.error);
    }
    
    function errorHandler(jqXHR,statusStr,errorStr) {
        alert(statusStr+' '+errorStr);
    }
    









    

   

    
    




          