const toggle = document.getElementById('toggle');
const nav = document.getElementById('nav');
const promptMenu = document.getElementById('help');
const menu = document.getElementById('menu');
const start = document.getElementById('start');
const myGame =  document.getElementById('myGame');
const about = document.getElementById('about');
const closeAbout = document.getElementById('closeAbout');
const closeRecords  = document.getElementById('closeRecords');
const records = document.getElementById('records');
const showRecords = document.getElementById('showRecords');

toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    promptMenu.innerHTML = "Let's play !!!"
    if(nav.offsetWidth !== 120) {
        promptMenu.innerHTML = "Click on the hamburger icon"
        
    }
});

toggle.addEventListener('touchstart', () => {
    nav.classList.toggle('active');
    promptMenu.innerHTML = "Let's play !!!"
    if(nav.offsetWidth !== 120) {
        promptMenu.innerHTML = "Click on the hamburger icon"
        
    }
});


start.addEventListener('click', startGame);
start.addEventListener('touchstart', startGame);

function startGame(){
    menu.style.display = "none";
    myGame.style.display = 'block';
}

about.addEventListener('click',aboutGameOpen);
about.addEventListener('touchstart',aboutGameOpen);


function aboutGameOpen() {
  document.getElementById('aboutGame').classList.add('--show')
}

closeAbout.addEventListener('click', aboutGameClose);
closeAbout.addEventListener('touchstart', aboutGameClose);  
    
function aboutGameClose() {
    document.getElementById('aboutGame').classList.remove('--show')
}

records.addEventListener('click', showRecordsGame);
records.addEventListener('touchstart', showRecordsGame); 

function showRecordsGame(){
    showRecords.style.display = "block";
    refreshMessages();

}

closeRecords.addEventListener('click', closeRecordsGame);
closeRecords.addEventListener('touchstart', closeRecordsGame);

function closeRecordsGame(){

    showRecords.animate([
        { // from
          opacity: 1,
        },
        { // to
          opacity: 0,
        }
      ], 2500);

    setTimeout(()=>showRecords.style.display = "none", 2500); 
    
}




