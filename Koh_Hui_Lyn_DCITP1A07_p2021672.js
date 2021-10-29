//Objects

//Word Collection houses all the words
class WordCollection {
    constructor(category){
        this.collection=[];
        if (category==1){
            for (var i=0; i<20;i++){
                this.collection.push(new Word(defineList[i],wordList[i]));
            }
        }
        if (category==2){
            for (var i=20; i<40;i++){
                this.collection.push(new Word(defineList[i],wordList[i]));
            }
        }

    }
    //This function rolls a random number, and chooses a word out of the array at the respective index.
    roll(){
        var random=Math.floor(Math.random()*(this.collection.length)); //choses a random number to pick from the list of 10 words (it's wordList.length as everytime a word gets picked, the length of array will be lessened.)
        this.selected = this.collection[random]; //selects words from pool
        this.collection.splice(random,1); //removes selected word from the list of words so cannot be picked again.
    }

    //This function displays underscores for each letter of the word
    letterDisp() { 
        underscore = new Array(); //makes new array filled with Underscores for each letter of word
        for(var i=0;i<this.selected.word.length;i++) {
            underscore[i]="_";
            process.stdout.write(underscore[i]+" ");
        }
        
        console.log();
    }
    
}

//Words class
class Word {
    constructor(define, word){
        this.define=define;
        this.word=word;
    }


    //This method displays the vowels of the selected word
    getVowels(){

        //Makes an array with the same elements as the current underscore (to check later on)
        var checkVowels=[];
        for (var i=0; i<underscore.length; i++){
            checkVowels[i]=underscore[i];
        }
        //Checks to see where word has vowels, and replaces underscore at respective index with those vowels.
        for (var i=0; i<this.word.length;i++){
            if(underscore[i]=="_"){
                switch (letArr[i]){
                    case "A":
                        underscore[i]="A";
                        break;
                    case "E":
                        underscore[i]="E";
                        break;
                    case "I":
                        underscore[i]="I";
                        break;
                    case "O":
                        underscore[i]="O";
                        break;
                    case "U":
                        underscore[i]="U";
                        break;
                }
            }
        }
        //Checking to see whether the new underscore (with new vowels) is diff from the old underscore
        for (var i=0; i<underscore.length; i++){
            if (underscore[i]==checkVowels[i]){
                player1.vowelsRevealed=false;
            }
            else{
                player1.vowelsRevealed=true;
                break;
            }
        }
        if (player1.vowelsRevealed==false)
            console.log("You already have all the vowels! Vowels Revealed not used");


    }

    //This function shows the definition of the word and minus some points from the player
    getDefine(){
        console.log("Definition is: "+this.define);
        if (player1.score>=20)
            player1.score-=20; //players will minus some score for using this hint
        else
            player1.score=0;
    }
}

//Player class
class Player {
    constructor(name){
        this.name=name;
        this.score=0;
        this.vowelsRevealed=false;
        this.useDefine=false;
        this.useSkip=false;
    }

    //After each word, scores will be added according to how many mistakes players made and whether or not they used skips.
    scoreMultiplier(mistakes){
        if (this.useSkip==false){ //if players use a skip, they cannot obtain points.
        this.score+= 80-10*(8-mistakes);
        }
    }
}


//General functions

//This function displays the 2 rows of available alphabets
function alphDisp() { 
    
    for(var a=0; a<26; a++) { //prints alphabets in straight line

        if (a==13) //splits alphabet count into 2 rows
            console.log("")

        process.stdout.write(alphabets[a]+" ")
    }
    
    console.log("");
    
}

//This function makes inputted alphabet disappear from the 2 rows of available alphabets
function useAlph() { 

    while(lives>0 && next==false){ //When the user has more than 1 life, and the user still cannot proceed to nxt round
        alphDisp();
        userInput = input.question("\033[33m"+name+"'s guess (Enter 9 for lifelines or 0 to pass): \033[0m").toUpperCase();

        while (alphabets.includes(userInput)==false && userInput!=9 && userInput!=0){  //will keep repeating this as long as input isnt 9 or 0.
                console.log("\033[31m\nInvalid input! Please re enter again!\033[0m")
                userInput = input.question("\033[33m"+name+"'s guess (Enter 9 for lifelines or 0 to pass): \033[0m").toUpperCase();
        }

        //Using Lifelines
        if (userInput==9){
            userInput=input.question("\033[33mEnter 9 to reveal vowels and 0 to get the definition\n\033[0m")

            while(userInput!=9 && userInput!=0){
                console.log("\n\033[31mInvalid input! Please re enter again!\033[0m")
                userInput = input.question("\033[33mEnter 9 to reveal vowels and 0 to get the definition\033[0m");  
            }
            if (userInput==9){
                if(player1.vowelsRevealed==false){
                    wordpool.selected.getVowels();
                    if (player1.vowelsRevealed==true)
                        console.log("\n\033[33mVowels revealed!\033[0m");
                }
                else
                    console.log("\n\033[31mVowels revealed lifeline already used in this game!\033[0m")
            }
            else if (userInput==0) 
                if (player1.useDefine==false){
                    console.log("\n\033[33mGetting definition!\033[0m")
                    wordpool.selected.getDefine();
                    player1.useDefine=true;
            }
            else
                console.log("\n\033[31mDefinition revealed lifeline already used in this game!\033[0m")
        }
        //Using Skip
        else if (userInput==0){
            if (player1.useSkip==false){
                console.log("\n\033[33mSkipping this word!\033[0m")
                player1.useSkip=true; //this variable lets the score multiplier know that shldn't give any scores (cannot use next to check as next is needed for a normal correct ans to move to next word, and that one need to give score.)
                next=true; //this variable allows for the checker to know that it should go to the next word
                break;
            }
            else
                console.log("\n\033[31mSkip already used.\033[0m")
        }

        for (var i=0; i<alphabets.length; i++){ //if inputed alphabet = to any alphabet in the word, it will disappear from the alphabets array
            if (userInput==alphabets[i]) 
                alphabets[i]=" ";

        }
        fill();
    }
}


//This function fills correct letters into the underscores
function fill() { 
    
    for (var i=0;i<wordpool.selected.word.length; i++){ //checks if letter typed is same as letter in word
        if (userInput==letArr[i])
            underscore[i]=userInput;
    }    

    if (wordpool.selected.word.includes(userInput)==false && userInput!=9 && userInput!=0){
        lives=lives-1; //if letter is not in word lives-1
        console.log("\n\033[33mSorry! "+userInput+" is not in the word!\n\033[0m");
    }

    for(var j=0;j<wordpool.selected.word.length;j++){ 
        process.stdout.write(underscore[j]+" "); //prints correct letters & underscores
    }

    console.log();
    checkLives();
    console.log();
    checkWord();
}

 //This function makes an Array that consists of letters in word
function makeArr() {
        letArr= new Array(); //array filled with letters of word
        for(var i=0; i<wordpool.selected.word.length;i++){
            letArr[i]=wordpool.selected.word.charAt(i);
    }

}

//This function displays the hanged man depending on your lives
function checkLives() { 
    console.log();
    switch (lives) {
        case 8:
            break;
        case 7:
            console.log(" _|_" );
            console.log("|   |______");
            console.log("|          |");
            console.log("|__________|");
            break;
        case 6:
            console.log("   ____");
            console.log("  |    |");
            console.log("  |");
            console.log("  |");
            console.log("  |");
            console.log("  |");
            console.log(" _|_" );
            console.log("|   |______");
            console.log("|          |");
            console.log("|__________|");
            break;
        case 5:
            console.log("   ____");
            console.log("  |    |");
            console.log("  |    o");
            console.log("  |");
            console.log("  |");
            console.log("  |");
            console.log(" _|_" );
            console.log("|   |______");
            console.log("|          |");
            console.log("|__________|");
            break;
        case 4:
            console.log("   ____");
            console.log("  |    |");
            console.log("  |    o");
            console.log("  |    |");
            console.log("  |    |");
            console.log("  |");
            console.log(" _|_" );
            console.log("|   |______");
            console.log("|          |");
            console.log("|__________|");
            break;
        case 3:
            console.log("   ____");
            console.log("  |    |");
            console.log("  |    o");
            console.log("  |   /|");
            console.log("  |    |");
            console.log("  |");
            console.log(" _|_" );
            console.log("|   |______");
            console.log("|          |");
            console.log("|__________|");  
            break;
        case 2:
            console.log("   ____");
            console.log("  |    |");
            console.log("  |    o");
            console.log("  |   /|\\");
            console.log("  |    |");
            console.log("  |");
            console.log(" _|_" );
            console.log("|   |______");
            console.log("|          |");
            console.log("|__________|"); 
            break;
        case 1:
            console.log("   ____");
            console.log("  |    |");
            console.log("  |    o");
            console.log("  |   /|\\");
            console.log("  |    |");
            console.log("  |   /");
            console.log(" _|_" );
            console.log("|   |______");
            console.log("|          |");
            console.log("|__________|"); 
            break;
        case 0:
            console.log("   ____");
            console.log("  |    |");
            console.log("  |    o");
            console.log("  |   /|\\");
            console.log("  |    |");
            console.log("  |   / \\");
            console.log(" _|_" );
            console.log("|   |______");
            console.log("|          |");
            console.log("|__________|"); 
            break;

    }
}

//This function checks if the word is guessed completely
function checkWord() {
    wordCheck=0; //this variable will check the amt of underscores in the inputted ans
    for (var i=0; i<letArr.length; i++){
        if (underscore[i]=="_"){
            wordCheck++;
        }
    }
    if (wordCheck==0 && lives>0) //if theres No underscores left in guessed word and player has more than 1 life
        next=true; //this variable will allow the user to proceed to next word.
    else
        next=false;
}

//============================================ Main ============================================


//Reading Data file
var fs = require('fs');
var wordList= [];
var defineList=[];
try {
        wordList = fs.readFileSync('/FoP/DCITP1A07_2021672/FOP assignment/hangmanWords.txt','ascii').split('\r\n');
        defineList = fs.readFileSync('/FoP/DCITP1A07_2021672/FOP assignment/hangmanDefine.txt','ascii').split('\r\n');
}
catch (err){
    console.log(err);
}

var playcount=1;
var underscore=[];
//Start game
console.log("\033[33m====『Welcome to Hangman』====\033[0m\n");
var input=require('readline-sync')
var name=input.question("Please enter your name: ");
while (name=="")//so users cannot leave their name blank
    name=input.question("Please enter your name: ");

while(name.length>6) {
    console.log("\033[31mName is too long! Please choose a name that is less than 6 characters!\033[0m")
    name=input.question("Please enter your name: ");
}    
console.log();
//Choosing category to play
console.log("Categories available:\n1)Animals 2)Fruits");
var category=input.questionInt("\033[36mChoose a category to play! \n\033[0m");
while (category!= 1 && category !=2){
    console.log("\033[31mPlease input a number that is 1 or 2!\033[0m");
    var category=input.questionInt("\033[36mChoose a category to play! \n\033[0m");
}
switch (category){
    case 1:
        console.log("\n\033[35mAnimals Category chosen!\033[0m");
        break;
    case 2:
        console.log("\n\033[35mFruits Category chosen!\033[0m");
}
player1=new Player(name);
var wordpool = new WordCollection(category);

//Repeats for 10 words (1 round)
do {
    var alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T",
                "U", "V","W","X","Y","Z"]; //resets the alphabet array
    next=false; 
    var lives = 8;
    console.log("Word "+playcount+"/10"); 
    wordpool.roll();
    wordpool.letterDisp();
    makeArr();
    useAlph();
    player1.scoreMultiplier(lives);
    playcount++;
}while (next==true && playcount<11)

if(lives==0)
    console.log("\033[31mYOU LOSE!\033[0m");
else
    console.log("\033[32mYOU WIN!\033[0m");


console.log(name+"'s score: "+player1.score);

var playerScores = require('fs');
try {
    playerScores.appendFileSync('/FoP/DCITP1A07_2021672/FOP assignment/scores.txt',player1.name+"\t"+player1.score+"\n");
    console.log("\033[32mScores saved!\033[0m");
} catch (err){
    console.log(err);
}

console.log("\033[33m===Leaderboard===\033[36m\nName\tScore\n\033[0m"+playerScores.readFileSync('/FoP/DCITP1A07_2021672/FOP assignment/scores.txt','ascii'));

var fs = require('fs');
var input=require('readline-sync');
seeStats = input.question("Would you like to see your user stats? Y/N ").toUpperCase();
while (seeStats!="Y" && seeStats!="N") {
    console.log("\033[31mPlease input Y/N!\033[0m");
    seeStats = input.question("Would you like to see your user stats? Y/N ").toUpperCase();
}


//Reading scores list
if (seeStats=="Y"){
    try {
        nameAndScore = fs.readFileSync('/FoP/DCITP1A07_2021672/FOP assignment/scores.txt','ascii').split('\n');
    }
    catch (err){
    console.log(err);
    }
    //Making an array of player name and scores seperated
    var nameScoreSeperate=[]
    for (var i=0; i<nameAndScore.length; i++){
        nameScoreSeperate.push(nameAndScore[i].split('\t'));
    }
    
    //Calculating the total sum
    var sum=0;
    var highest= 0;
    var lowest = 99999;
    var timesAppeared=0;
    //If person's name appear before, will take the score value
    for(var i=0; i<nameScoreSeperate.length;i++){

        if (nameScoreSeperate[i][0]==player1.name){
            //Calculating average score
            sum+=parseInt(nameScoreSeperate[i][1]);
            timesAppeared++;
            //Looking for highest score
            if (nameScoreSeperate[i][1]>highest){
                highest=nameScoreSeperate[i][1];
            }
            //Looking for lowest score
            if (nameScoreSeperate[i][1]<lowest){
                lowest=nameScoreSeperate[i][1];
            }
        }

    }

    var average= sum/timesAppeared;
    console.log("\n\033[33m======"+player1.name+"'s Stats======\033[36m\nAverage Score: "+average.toFixed(2)+"\n\033[35mHighest Score: "+highest+"\n\033[31mLowest Score: "+lowest+"\033[0m");
}

