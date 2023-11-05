const userDataDiv = document.querySelector('#userData');
const receiverDataDiv = document.querySelector('#receiverData');
let messages = document.querySelector('#messages');

const userData = JSON.parse(userDataDiv.value);
const receiverData = JSON.parse(receiverDataDiv.value);

console.log(userData);
console.log(receiverData);


let i = 0, u = 0, r = 0;
while(userData.chat.length != [] && receiverData.chat != []){
    while(userData.chat[0].message != [] && receiverData.chat[0].message != []){
        if(userData.chat[0].message[0].timeMsg <= receiverData.chat[0].message[r].timeMsg){
            const messageDiv = 
            `<div class="message-div right">
                <p>${userData.chat[0].message[0].text}</p>
            </div>`;
    
            userData.chat[0].message.shift();
            
            messages += messageDiv;
    
            u++;
        }
        else {
            const messageDiv = 
            `<div class="message-div left">
            <p>${receiverData.chat[0].message[0].text}</p>
            </div>`;
    
            receiverData.chat[0].message.shift();
            
            messages += messageDiv;
    
            r++
        }

    }
    

    i++;
}