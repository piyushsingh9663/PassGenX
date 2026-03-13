const inputSlide=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNum]");
const psswrdDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector(".copyBtn");
const copyMsg=document.querySelector("[data-copyingMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#number");
const symbolCheck=document.querySelector("#symbols");
const strengthBtn=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols = "~`!@#$%^&*()_-+={}[]<>,.?/\|" ;

let password="";
let passwordLength=10;
let checkCnt=0;
handleSlider();

setIndicator("#ccc"); 
function handleSlider(){
    inputSlide.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlide.min;
    const max=inputSlide.max; 
    inputSlide.style.backgroundSize= ( (passwordLength-min)*100/(max-min)) + "% 100%";
}
function setIndicator(color){
    strengthBtn.style.backgroundColor=color;
    strengthBtn.style.boxShadow=`0px 0px 12px 1px ${color}`;
}
function getRandomInteger(min, max) {
    const range = max - min;
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    return min + (randomBuffer[0] % range);
}
function generateRandomNumber(){
    return getRandomInteger(0,10);
}
function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97,123));
}
function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65,91));
}
function generateSymbol(){
    const randNum=getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}
function calcStrength(){
    let score=0;
    if(uppercaseCheck.checked)score++;
    if(lowercaseCheck.checked)score++;
    if(numbersCheck.checked)score++;
    if(symbolCheck.checked)score++;

    if(passwordLength>=6)score++;

    if(score>4){
        setIndicator("#0f0");
    }
    else if(score>=3){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){  
    try{
       await navigator.clipboard.writeText(psswrdDisplay.value);
       copyMsg.innerText ="copied";
    } 
    catch(e){
       copyMsg.innerText="Failed";  
    }
    //to make copy msg visible
    copyMsg.classList.add("active");
    setTimeout( ()=>{
       copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    //fisher yates method
    for(let i=array.length-1;i>0;i--){
        const j=getRandomInteger(0,i+1);
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
  
    }
    let str="";
    array.forEach((el)=>(str += el));
    return str;
}

function handleCheckCnt(){
    checkCnt=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCnt++; 
    })
    if(passwordLength<checkCnt){
        passwordLength=checkCnt;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckCnt);
})

inputSlide.addEventListener('input',(e)=>{
   passwordLength=e.target.value;
   handleSlider();  
})

copyBtn.addEventListener('click',()=>{
    if(psswrdDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click',()=>{
    if(checkCnt<=0){
        alert("Select at least one character type");
        return;
    }
    if(passwordLength<checkCnt){
        passwordLength=checkCnt;
        handleSlider();
    }
    //remove old psswrd
    password="";
   //one way
    // if(uppercaseCheck.checked){
    //     password += generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowercase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }

    //other way
    let funArr=[];
     
    if(uppercaseCheck.checked)
        funArr.push(generateUppercase);
    
    if(lowercaseCheck.checked)
        funArr.push(generateLowercase);

    if(numbersCheck.checked)
        funArr.push(generateRandomNumber);

    if(symbolCheck.checked)
        funArr.push(generateSymbol);
// compulsory additon
    for(let i=0;i<funArr.length;i++){ 
        password += funArr[i]();
    }
// remaining length of psswrd
    for(let i=0; i<passwordLength-funArr.length;i++){
        let randInd=getRandomInteger(0,funArr.length);
        password += funArr[randInd]();
    }

    //shuffle the char
    password=shufflePassword(Array.from(password));

    psswrdDisplay.value=password;

    calcStrength();
})

document.addEventListener('keydown',(e)=>{
    if(e.ctrlKey && e.key=="Enter"){
        generateBtn.click();
    }
})