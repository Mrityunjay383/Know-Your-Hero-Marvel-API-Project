var i = 0;
var txt = 'Get amazing Information about your favorite Marvel Character'; /* The text */
var speed = 50; /* The speed/duration of the effect in milliseconds */

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("typedTxt").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

function disBtn(){
  document.getElementById('lernBtn').classList.add("btnAnima");
}

typeWriter();
setTimeout(disBtn, (speed * txt.length)+100 );
