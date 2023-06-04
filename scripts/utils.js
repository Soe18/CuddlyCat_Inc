var startingTime = 300;
function setTimer(timeChoosen) {
    startingTime = timeChoosen*60;
    console.log(startingTime+" VEO VEO");
}

function changeColor(id1, id2){
    $(id1).css("background-color","#374A21");
    $(id2).css("background-color","#C4DEA4");

    $(id1).css("color","#F6F6DB");
    $(id2).css("color","#7B6B50");
}

function changeColor(id1, id2, id3){
    $(id1).css("background-color","#465d2b");
    $(id2).css("background-color","#C4DEA4");
    $(id3).css("background-color","#C4DEA4");

    $(id1).css("color","#F6F6DB");
    $(id2).css("color","#7B6B50");
    $(id3).css("color","#7B6B50");
}