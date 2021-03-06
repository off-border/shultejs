'use strict';

function Shulte(selector){
    console.log('creating new scene');

    this.selector = selector;

    this.snap = Snap(selector);

    this.size = 3;
    this.cellPadding = 10;
    this.cellBorderWidth = 2;
    this.cellBorderColor = '#aaa';
    this.cellBorderRadius = 10;
    this.cellBgColor  = 'white';
    this.cellClickedColor = '#9ef09e';
    this.cellFontColor = '#555';

    this.cells = [];
    this.nextNumber = 1;

    this.snap.click(function(){
        if( this.nextNumber && this.nextNumber === -1 )
            this.start();
    }.bind(this) );

    this.createCells();
    this.smileCells();

    window.snap = this.snap;

}


Shulte.prototype.start = function(){
    console.log('starting new game');

    this.createCells();
    this.nextNumber = 1;
    this.startTime = new Date();
    this.gameStarted && this.gameStarted();
    clearInterval(this._timer);
    this._timer = setInterval(function(){
        this.time = new Date - this.startTime;
        this.timerTicked && this.timerTicked( this.time );
    }.bind(this), 100);
}

Shulte.prototype.stop = function(){
    this.smileCells();
    this.stopTime = new Date();
    this.time = this.stopTime - this.startTime;
    this.gameStopped && this.gameStopped();
    clearInterval(this._timer);
}

Shulte.prototype.createCells = function(){
    this.snap.clear();
    this.cells.splice(0,this.cells.length);

    var tmp = [];
    this.numbers = [];
    for(let i=1; i <= this.size*this.size; i++)
        tmp.push(i);
    for(let i=0; i < this.size*this.size; i++){
        let index = Math.floor(Math.random()*tmp.length)
        this.numbers.push( tmp.splice( index, 1 )[0] );
    }

    for( let row = 0; row < this.size; row++ ){
        for( let col = 0; col < this.size; col++ ){
            let cell = this.snap.rect(0,0,0,0);
            cell.number = this.numbers[ this.size*row + col ];
            cell.text = this.snap.text( 0,0, cell.number );
            cell.mousedown( this._cellClicked.bind(this,cell) );
            cell.text.mousedown( this._cellClicked.bind(this,cell) );
            this.cells.push(cell);
        }
    }
    this.alignCells();
}

Shulte.prototype.alignCells = function(){

    var tbWidth = this.snap.node.getBoundingClientRect().width - parseInt(getComputedStyle(this.snap.node)["border-left-width"]) * 2;
    var cellWidth = (tbWidth - this.cellPadding ) / this.size - this.cellPadding;
    var fontSize = cellWidth / 2;

    for( let row = 0; row < this.size; row++ ){
        for( let col = 0; col < this.size; col++ ){

            let x = ( cellWidth + this.cellPadding ) * col + this.cellPadding;
            let y = ( cellWidth + this.cellPadding ) * row + this.cellPadding;

            let cell = this.cells[ this.size*row + col ];

            cell.attr({
                x: x,
                y: y,
                width: cellWidth,
                height: cellWidth,
                fill: this.cellBgColor,
                stroke: this.cellBorderColor,
                strokeWidth: this.cellBorderWidth,
                rx: "1%",
                ry: "1%"
            });
            cell.text.attr({
                x: x + cellWidth / 2,
                y: y + cellWidth / 2 + fontSize/3 ,
                fontSize: fontSize,
                textAnchor: 'middle',
                fill: this.cellFontColor,
                cursor: 'default',
            });
        }
    }
}

Shulte.prototype._cellClicked = function( cell ){
    if( cell.number !== this.nextNumber )
        return;
    cell.attr({
        fill: this.cellClickedColor
    })
    cell.animate({
        fill: this.cellBgColor
    }, 500 );


    this.cellClicked && this.cellClicked(this.nextNumber);

    this.nextNumber++;
    if( this.nextNumber > this.size*this.size ){
        console.log('---DONE---')
        clearInterval( this._timer );
        this.smileCells();
        this.gameFinished && this.gameFinished();
        return;
    }


}


Shulte.prototype.smileCells = function(){
    for( let cell of this.cells ){
        cell.text.attr( {text: ":)"} );
        setTimeout( ()=> this.nextNumber = -1, 200 );
    }
}
