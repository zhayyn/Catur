/* developed by zhayyn™ */
window.onload = function() {
    var w = window.innerWidth || 360;
    var h = window.innerHeight || 500;
    var tsw = (w > h) ? h : w;
    var sw = (tsw - 16) / 8;
    var container = document.getElementById("container");

    for(var n = 0; n < 64; n++){
        var square = document.createElement("div");
        square.classList.add("square", "s"+n);
        square.style.height = sw + 'px';
        square.style.width = sw + 'px';
        square.style.top = 7 + (h-tsw)/2 + sw*(Math.floor(n/8)) + 'px';
        square.style.left = 7 + (w-tsw)/2 + sw*(Math.floor(n%8)) + 'px';
        square.style.fontSize = sw*0.75 + 'px';
        container.appendChild(square);
    }

    var fonts = {
        'k':'&#9818;', 'q':'&#9819;', 'r':'&#9820;', 'b':'&#9821;', 'n':'&#9822;', 'p':'&#9823;',
        'l':'&#9812;', 'w':'&#9813;', 't':'&#9814;', 'v':'&#9815;', 'm':'&#9816;', 'o':'&#9817;'
    };
    
    var values = [
        'r','n','b','q','k','b','n','r',
        'p','p','p','p','p','p','p','p',
        0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,
        'o','o','o','o','o','o','o','o',
        't','m','v','w','l','v','m','t'
    ];
    
    var ck = false, cr1 = false, cr2 = false, cl;
    var sqs = document.getElementsByClassName("square");

    for(var n = 0; n < 64; n++){
        if(values[n] !== 0) sqs[n].innerHTML = fonts[values[n]];
        sqs[n].addEventListener("click", check);
    }
    
    function updateSquarecolor(){
        for(var n = 0; n < 64; n++){
            var isEvenRow = Math.floor(n/8) % 2 === 0;
            var isEvenCol = n % 2 === 0;
            if((isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol)){
                sqs[n].style.background = 'rgba(226, 232, 240, 0.75)'; 
                sqs[n].style.color = '#000';
            } else {
                sqs[n].style.background = 'rgba(30, 58, 138, 0.75)'; 
                sqs[n].style.color = '#fff';
            }
            sqs[n].style.boxShadow = "inset 0 0 15px rgba(255,255,255,0.1)";
        }
    }
    updateSquarecolor();

    /* developed by zhayyn™ */

    var moveable = false;
    var moveTarget = "";
    var moveScopes = [];

    function checkBlack(n, values){
        var target = values[n];
        var scopes = [];
        var x = n;
        
        if(target === "o"){ 
            x -= 8;
            if("prnbkq".indexOf(values[x-1]) >= 0 && x%8 != 0) scopes.push(x-1);
            if("prnbkq".indexOf(values[x+1]) >= 0 && x%8 != 7) scopes.push(x+1);
            if(x >= 0 && values[x] === 0){
                scopes.push(x);
                if(x >= 40 && values[x-8] === 0) scopes.push(x-8);
            }
        }
        else if(target === "t"){ 
            var dirs = [-8, 8, 1, -1];
            for(var i=0; i<dirs.length; i++){
                var d = dirs[i]; x = n + d;
                while(x>=0 && x<64){
                    if(d===1 && x%8===0) break;
                    if(d===-1 && x%8===7) break;
                    if(values[x] === 0) scopes.push(x);
                    else { if("prnbqk".indexOf(values[x]) >= 0) scopes.push(x); break; }
                    x += d;
                }
            }
        }
        else if(target === "m"){ 
            var moves = [-17, -15, -10, -6, 6, 10, 15, 17];
            for(var i=0; i<moves.length; i++){
                var dest = n + moves[i];
                if(dest>=0 && dest<64){
                    if(Math.abs((n%8) - (dest%8)) <= 2){
                        if("prnbqk".indexOf(values[dest]) >= 0 || values[dest] === 0) scopes.push(dest);
                    }
                }
            }
        }
        else if(target === "v"){ 
            var dirs = [-9, -7, 7, 9];
            for(var i=0; i<dirs.length; i++){
                var d = dirs[i]; x = n + d;
                while(x>=0 && x<64){
                    if(Math.abs(((x-d)%8) - (x%8)) > 2) break;
                    if(values[x] === 0) scopes.push(x);
                    else { if("prnbqk".indexOf(values[x]) >= 0) scopes.push(x); break; }
                    x += d;
                }
            }
        }
        else if(target === "w"){ 
            var dirs = [-9, -8, -7, -1, 1, 7, 8, 9];
            for(var i=0; i<dirs.length; i++){
                var d = dirs[i]; x = n + d;
                while(x>=0 && x<64){
                    if(Math.abs(((x-d)%8) - (x%8)) > 2) break;
                    if(values[x] === 0) scopes.push(x);
                    else { if("prnbqk".indexOf(values[x]) >= 0) scopes.push(x); break; }
                    x += d;
                }
            }
        }
        else if(target === "l"){ 
            var dirs = [-9, -8, -7, -1, 1, 7, 8, 9];
            for(var i=0; i<dirs.length; i++){
                var dest = n + dirs[i];
                if(dest>=0 && dest<64 && Math.abs((n%8) - (dest%8)) <= 1){
                    if("prnbqk".indexOf(values[dest]) >= 0 || values[dest] === 0) scopes.push(dest);
                }
            }
        }
        if(scopes.length) return scopes;
    }

    function checkWhite(n, values){
        var target = values[n];
        var scopes = [];
        var x = n;
        
        if(target === "p"){ 
            x += 8;
            if("otmvlw".indexOf(values[x-1]) >= 0 && x%8 != 0) scopes.push(x-1);
            if("otmvlw".indexOf(values[x+1]) >= 0 && x%8 != 7) scopes.push(x+1);
            if(x < 64 && values[x] === 0){
                scopes.push(x);
                if(x <= 23 && values[x+8] === 0) scopes.push(x+8);
            }
        }
        else if(target === "r"){ 
            var dirs = [-8, 8, 1, -1];
            for(var i=0; i<dirs.length; i++){
                var d = dirs[i]; x = n + d;
                while(x>=0 && x<64){
                    if(d===1 && x%8===0) break;
                    if(d===-1 && x%8===7) break;
                    if(values[x] === 0) scopes.push(x);
                    else { if("otmvlw".indexOf(values[x]) >= 0) scopes.push(x); break; }
                    x += d;
                }
            }
        }
        else if(target === "n"){ 
            var moves = [-17, -15, -10, -6, 6, 10, 15, 17];
            for(var i=0; i<moves.length; i++){
                var dest = n + moves[i];
                if(dest>=0 && dest<64){
                    if(Math.abs((n%8) - (dest%8)) <= 2){
                        if("otmvlw".indexOf(values[dest]) >= 0 || values[dest] === 0) scopes.push(dest);
                    }
                }
            }
        }
        else if(target === "b"){ 
            var dirs = [-9, -7, 7, 9];
            for(var i=0; i<dirs.length; i++){
                var d = dirs[i]; x = n + d;
                while(x>=0 && x<64){
                    if(Math.abs(((x-d)%8) - (x%8)) > 2) break;
                    if(values[x] === 0) scopes.push(x);
                    else { if("otmvlw".indexOf(values[x]) >= 0) scopes.push(x); break; }
                    x += d;
                }
            }
        }
        else if(target === "q"){ 
            var dirs = [-9, -8, -7, -1, 1, 7, 8, 9];
            for(var i=0; i<dirs.length; i++){
                var d = dirs[i]; x = n + d;
                while(x>=0 && x<64){
                    if(Math.abs(((x-d)%8) - (x%8)) > 2) break;
                    if(values[x] === 0) scopes.push(x);
                    else { if("otmvlw".indexOf(values[x]) >= 0) scopes.push(x); break; }
                    x += d;
                }
            }
        }
        else if(target === "k"){ 
            var dirs = [-9, -8, -7, -1, 1, 7, 8, 9];
            for(var i=0; i<dirs.length; i++){
                var dest = n + dirs[i];
                if(dest>=0 && dest<64 && Math.abs((n%8) - (dest%8)) <= 1){
                    if("otmvlw".indexOf(values[dest]) >= 0 || values[dest] === 0) scopes.push(dest);
                }
            }
        }
        if(scopes.length) return scopes;
    }

    var myTurn = true;

    function check(){
        if(myTurn){
            var n = Number(this.classList[1].slice(1));
            var target = values[n];
            var scopes = checkBlack(n, values) || [];

            if(!moveable){
                if(scopes.length > 0){
                    moveable = true;
                    moveTarget = n;
                    moveScopes = scopes.join(",").split(",");
                }
            } else {
                if(moveScopes.indexOf(String(n)) >= 0){
                    var checkArr = [];
                    var saveKing = false;
                    for(var z = 0; z < 64; z++) checkArr[z] = values[z];
                    
                    checkArr[n] = checkArr[moveTarget];
                    checkArr[moveTarget] = 0;
                    
                    for(var y = 0; y < 64; y++){
                        if("prnbkq".indexOf(checkArr[y]) >= 0){
                            var checkScp = checkWhite(y, checkArr) || [];
                            for(var z = 0; z < checkScp.length; z++){
                                if(checkArr[checkScp[z]] === 'l'){
                                    if(!saveKing){ alert('Save Your King!'); saveKing = true; }
                                }
                            }
                        }
                    }
                    
                    if(!saveKing){
                        values[n] = values[moveTarget];
                        values[moveTarget] = 0;
                        if(values[n] === "o" && n < 8) values[n] = "w"; 
                        
                        moveable = false;
                        scopes = [];
                        myTurn = false;
                        setTimeout(chooseTurn, 600);
                    }
                } else {
                    moveScopes = [];
                    moveable = false;
                }
            }

            updateSquarecolor();
            for(var x = 0; x < 64; x++){
                sqs[x].innerHTML = fonts[values[x]];
                if(values[x] === 0) sqs[x].innerHTML = "";
            }

            for(var x = 0; x < scopes.length; x++){
                sqs[scopes[x]].style.background = "rgba(239, 68, 68, 0.8)"; 
            }
        }
    }

    function chooseTurn(){
        var approved = [];
        var actions = [];
        var effects = [];

        for(var n = 0; n < 64; n++){
            if("prnbqk".indexOf(values[n]) >= 0){
                var scopes = checkWhite(n, values) || [];
                for(var x = 0; x < scopes.length; x++){
                    var tmp = [];
                    for(var xx = 0; xx < 64; xx++) tmp[xx] = values[xx];
                    
                    var effect = 0;
                    var action = Math.random() * 5; 
                    var actionValue = tmp[scopes[x]];
                    
                    if(actionValue === "l") action = 200 + Math.random()*10;
                    else if(actionValue === "w") action = 90 + Math.random()*5;
                    else if(actionValue === "v" || actionValue === "m" || actionValue === "t") action = 40 + Math.random()*5;
                    else if(actionValue === "o") action = 15 + Math.random()*5;

                    var centerSquares = [27, 28, 35, 36, 26, 29, 34, 37];
                    if(centerSquares.indexOf(scopes[x]) >= 0) {
                        action += 10; 
                    }

                    tmp[scopes[x]] = tmp[n];
                    tmp[n] = 0;
                    
                    for(var y = 0; y < 64; y++){
                        if("otmvlw".indexOf(values[y]) >= 0){
                            var tmpScp = checkBlack(y, tmp) || [];
                            for(var z = 0; z < tmpScp.length; z++){
                                var effectValue = tmp[tmpScp[z]];
                                if(effectValue == "k" && effect < 100) effect = 100;
                                else if(effectValue == "q" && effect < 50) effect = 50;
                                else if((effectValue == "b" || effectValue == "n" || effectValue == "r") && effect < 30) effect = 30;
                                else if(effectValue == "p" && effect < 15) effect = 15;
                            }
                        }
                    }

                    actions.push(action);
                    effects.push(effect);
                    approved.push(n + "-" + scopes[x]);
                }
            }
        }

        var bestEffect = Math.min.apply(null, effects);
        if(bestEffect >= 100){
            alert("Checkmate! Tuan Muda Menang!");
            setTimeout(function(){ location.reload(); }, 2000);
            return;
        }

        var tmpA = [], tmpB = [], tmpC = [];
        var bestMove = "";

        for(var n = 0; n < effects.length; n++){
            if(effects[n] === bestEffect){
                tmpA.push(actions[n]);
                tmpB.push(approved[n]);
                tmpC.push(effects[n]);
            }
        }
        
        if(tmpA.length > 0) {
            bestMove = tmpB[tmpA.indexOf(Math.max.apply(null, tmpA))];
        }

        if(bestMove){
            var fromIdx = Number(bestMove.split("-")[0]);
            var toIdx = Number(bestMove.split("-")[1]);
            
            values[toIdx] = values[fromIdx];
            values[fromIdx] = 0;
            if(values[toIdx] === "p" && toIdx >= 56) values[toIdx] = "q"; 

            updateSquarecolor();
            sqs[fromIdx].style.background = 'rgba(251, 191, 36, 0.7)'; 
            sqs[toIdx].style.background = 'rgba(251, 191, 36, 0.9)';   

            for(var x = 0; x < 64; x++){
                sqs[x].innerHTML = fonts[values[x]];
                if(values[x] === 0) sqs[x].innerHTML = "";
            }
            myTurn = true;
        } else {
            alert('Stalemate / AI tidak bisa bergerak');
        }
    }
}
/* developed by zhayyn™ */