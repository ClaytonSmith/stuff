'use strict'

const readline = require('readline');
const fs = require('fs');


// Exports for testing...


function makeBoard(){

    var board = Array.apply(null, Array(4)).map(function () {
        return Array.apply(null, Array(4)).map(function () {
            return String.fromCharCode(65 + Math.floor(Math.random() * 100) % 26)
        })
    })

    //    Console.log('Boggle board generated')
    return board;
}

exports.makeBoard = makeBoard;

exports.testBoard = [
    ['C', 'A', 'T', 'T'],
    ['H', 'I', 'M', 'I'],
    ['A', 'N', 'G', 'G'],
    ['P', 'E', 'A', 'R']
];


// Inspiration from: https://stackoverflow.com/questions/11173254/n-ary-tree-in-javascript
function createEntry(tree, word) {
    var node = tree;

    word = word.toUpperCase();
    
    for(var i = 0; i < word.length; i++){
        node = node[ word[i] ] = !!node[ word[i] ] ? node[ word[i] ] : {}
    }
    
    // Completed word. Terminate
    node.terminal = true;
    return tree
}
exports.createEntry = createEntry;


function loadDictionary(dicFile, cb){

    var dictionary = {}
    
    const rl = readline.createInterface({
        input: fs.createReadStream( dicFile )
    });
    
    rl.on('line', function(word){ return createEntry(dictionary, word);});

    rl.on('close', function(){ cb(dictionary) });
}

exports.loadDictionary = loadDictionary;


function boggleMe(board, dictionary){
    
    /*
      +----+----+----+----+
      | 00 | 01 | 02 | 03 |
      +----+----+----+----+
      | 10 | 11 | 12 | 13 |
      +----+----+----+----+
      | 20 | 21 | 22 | 23 |
      +----+----+----+----+
      | 30 | 31 | 32 | 33 |
      +----+----+----+----+
    */

    board.forEach( function(row, rowI){
        row.forEach(function(cell, colJ){
            // console.log(  dictionary, cell );
            lookArround(rowI, colJ, dictionary[cell], ""+ cell);
        })
    });

    
    function lookArround(i,j, tree, currentWord){

        if ('terminal' in tree && currentWord.length > 2){
            console.log("    - "+ currentWord);
        }

        var iCheck = [-1, 0, 1];
        var jCheck = [-1, 0, 1];
    
        iCheck.forEach(function(iDirection){
            jCheck.forEach(function(jDirection){

                if( iDirection == 0 && jDirection == 0) return
                
                var absI = i + iDirection;
                var absJ = j + jDirection;

                if( absI >= 0 && absJ >= 0
                    && absI < board.length && absJ < board[absI].length &&      // Don't break on edge 
                    board[absI][absJ] in tree ){   // Are we part of a word?
                    lookArround(absI, absJ, tree[board[absI][absJ]], currentWord + board[absI][absJ])
                }
            });
        });
    }
    
    // /// Protecting against...
    // // top
    // if( i != 0 && board[i-1][j] in tree){
    //     lookArround([i-1][j], tree[board[i-1][j]], currentWord + board[i-1][j])
    // }

    
    // // top and side
    // if( i != 0 && board[i-1][j] in tree){
    //     lookArround([i-1][j], tree[board[i-1][j]], currentWord + board[i-1][j])
    // }
    // board[i-1][j+1]
    
    // // side
    // if( i != 0 && board[i-1][j] in tree){
    //     lookArround([i-1][j], tree[board[i-1][j]], currentWord + board[i-1][j])
    // }
    // board[i][j+1]
    
    // // side and bottom
    // if( i != 0 && board[i-1][j] in tree){
    //     lookArround([i-1][j], tree[board[i-1][j]], currentWord + board[i-1][j])
    // }
    // board[i+1][j+1]
    
    // // bottom
    // if( i != 0 && board[i-1][j] in tree){
    //     lookArround([i-1][j], tree[board[i-1][j]], currentWord + board[i-1][j])
    // }
    // board[i+1][j]
    
    // // bottom and other side
    // if( i != 0 && board[i-1][j] in tree){
    //     lookArround([i-1][j], tree[board[i-1][j]], currentWord + board[i-1][j])
    // }
    // board[i+1][j-1]
    
    // // other side
    // if( j != 0 &&
    //     board[i][j-1] in tree){
    //     lookArround(i, j-1, tree[board[i][j-1]], currentWord + board[i][j-1])
    // }
    
    // // top and other side
    // if( i != 0 && j != 0 &&
    //     board[i-1][j-1] in tree){
    //     lookArround(i-1, j-1, tree[board[i-1][j-1]], currentWord + board[i-1][j-1])
    // }        
}
exports.boggleMe = boggleMe;


function Boggle(){

    var wordsFP  = process.argv[2]
    var board    = makeBoard();
    
    loadDictionary( wordsFP, function(words){
        console.log(board)
        boggleMe(board, words);
    });
}

exports.main = Boggle;


Boggle();
