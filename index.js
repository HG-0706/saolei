function Mine(tr, td, mineNum) {
    this.td = td;
    this.tr = tr;
    this.mineNum = mineNum;

    this.squares = []; //存储格子信息
    this.tds = []; //存储所有格子Dom
    this.surplus = mineNum;
    this.allRight = false;

    this.parent = document.querySelector('.game-area');
}
Mine.prototype.init = function() {
        //获取雷的位置
        var rn = this.randomNum();
        var n = 0;
        for (var i = 0; i < this.tr; i++) {
            this.squares[i] = [];
            for (var j = 0; j < this.td; j++) {

                if (rn.indexOf(++n) != -1) {
                    this.squares[i][j] = { type: 'mine', x: j, y: i };
                } else {
                    this.squares[i][j] = { type: 'number', x: j, y: i, value: 0 };
                }
            }
        }
        this.surplus = this.mineNum;
        //console.log(this.squares);
        this.updataNum();
        this.createDom();


    }
    //获取mineNum个随机数
Mine.prototype.randomNum = function() {
        var square = new Array(this.td * this.tr)
        for (var i = 0; i < square.length; i++) {
            square[i] = i;
        }
        square.sort(function() { return 0.5 - Math.random() });
        //console.log(square);
        return square.slice(0, this.mineNum);

    }
    //查询雷周围的格子
Mine.prototype.getAround = function(square) {
    var x = square.x;
    var y = square.y;
    var result = [];
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (i < 0 ||
                j < 0 ||
                i > this.tr - 1 ||
                j > this.td - 1 ||
                (i == x && j == y) ||
                this.squares[j][i].type == 'mine') {
                continue;
            }
            result.push([j, i])
        }
    }
    return result;
}

Mine.prototype.createDom = function() {
    var This = this;
    var table = document.createElement('table');
    for (var i = 0; i < this.tr; i++) {
        var domTr = document.createElement('tr');
        this.tds[i] = [];
        for (var j = 0; j < this.td; j++) {
            var domTd = document.createElement('td');
            // domTd.innerHTML = 0;
            domTd.pos = [i, j]; //检查与取到的值是否相等
            domTd.onmousedown = function() {
                This.play(event, this);
            }
            this.tds[i][j] = domTd;
            // if (this.squares[i][j].type == 'mine') {
            //     domTd.className = 'mine';
            // }
            // if (this.squares[i][j].type == 'number') {
            //     domTd.innerHTML = this.squares[i][j].value;
            // }
            domTr.appendChild(domTd);
        }
        table.appendChild(domTr);

        table.oncontextmenu = function() {
            return false;
        }
        this.mineNumDom = document.querySelector('.mineNum');
        this.mineNumDom.innerHTML = this.surplus;
    }
    this.parent.innerHTML = '';
    this.parent.appendChild(table);
}
Mine.prototype.updataNum = function() {
    for (var i = 0; i < this.tr; i++) {
        for (var j = 0; j < this.td; j++) {
            if (this.squares[i][j].type == 'number') {
                continue;
            }
            var num = this.getAround(this.squares[i][j]);
            //console.log(num);
            for (var k = 0; k < num.length; k++) {
                this.squares[num[k][0]][num[k][1]].value += 1;
            }
        }
    }
}
Mine.prototype.play = function(event, obj) {

    if (event.which == 1 && obj.className != 'flag') { //鼠标左键

        //console.log(obj);
        var curSquare = this.squares[obj.pos[0]][obj.pos[1]];
        //console.log(curSquare);
        var cl = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
        if (curSquare.type == 'number') {

            //console.log('你点到数字了')
            obj.innerHTML = curSquare.value;
            obj.className = cl[curSquare.value];
            var This = this;
            if (curSquare.value == 0) {
                obj.innerHTML = '';


                function getAllZero(square) {
                    var around = This.getAround(square);

                    for (var i = 0; i < around.length; i++) {
                        var x = around[i][0];
                        var y = around[i][1];
                        This.tds[x][y].className = cl[This.squares[x][y].value];
                        if (This.squares[x][y].value == 0) {
                            if (!This.tds[x][y].check) {
                                This.tds[x][y].check = true;
                                getAllZero(This.squares[x][y]);
                            }

                        } else {
                            This.tds[x][y].innerHTML = This.squares[x][y].value;
                        }
                    }
                }
                getAllZero(curSquare);

            }
        } else { //点击的是雷

            this.gameOver(obj);


        }
    }
    if (event.which == 3) { //鼠标右键 obj取到的是tdDom
        if (obj.className && obj.className != 'flag') {
            return;
        }
        obj.className = obj.className == 'flag' ? '' : 'flag';
        // console.log(obj);

        if (this.squares[obj.pos[0]][obj.pos[1]].type == 'mine') {
            this.allRight = true;
        } else {
            this.allRight = false;
        }
        if (obj.className == 'flag') {
            this.mineNumDom.innerHTML = --this.surplus;
        } else {
            this.mineNumDom.innerHTML = ++this.surplus;
        }
        if (this.surplus == 0) {
            if (this.allRight) {
                alert('恭喜你，游戏通过');
            } else {
                alert('游戏失败');
                this.gameOver();
            }

        }
    }

};
Mine.prototype.gameOver = function(clickTd) {

    for (var i = 0; i < this.tr; i++) {
        for (var j = 0; j < this.td; j++) {
            if (this.squares[i][j].type == 'mine') {
                this.tds[i][j].className = 'mine';
            }

            this.tds[i][j].onmousedown = null;

        }
    }

    if (clickTd) {
        clickTd.style.backgroundColor = '#f00';

    }

}

var btns = document.querySelectorAll('.level button');
//console.log(btns);
var ln = 0;
var mine = null;
var arr = [
    [9, 9, 10],
    [16, 16, 40],
    [28, 28, 99]
];
for (let i = 0; i < btns.length - 1; i++) {
    btns[i].onclick = function() {
        btns[ln].className = '';
        btns[i].className = 'active';
        mine = new Mine(...arr[i]);
        mine.init();
        ln = i;
    }
}
btns[0].onclick();
btns[3].onclick = function() {
    mine.init();
}

// var mine = new Mine(28, 28, 99);
// mine.init();