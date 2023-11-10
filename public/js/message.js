const userDataDiv = document.querySelector('#userData');
const receiverDataDiv = document.querySelector('#receiverData');
let messages = document.querySelector('#messages');
// console.log(messages.innerHTML)

const userData = JSON.parse(userDataDiv.value);
const receiverData = JSON.parse(receiverDataDiv.value);

console.log(userData);
console.log(receiverData);
// console.log(new Date().getTime());
// console.log(typeof(userData.chat[0].message[0].timeMsg));
// console.log(1699291281016 <= 1699291238406);

// setTimeout(function(){
//     window.stop();
// }, 2000);


let i = 0, u = 0, r = 0;
while(userData.chat.length != 0 && receiverData.chat.length != 0){
    // console.log("userData.chat");
    // console.log(userData.chat);
    // console.log("receiverData.chat");
    // console.log(receiverData.chat);
    while(userData.chat[0].message.length != 0 || receiverData.chat[0].message.length != 0){
        console.log("log");
        if((userData.chat[0].message[0] && receiverData.chat[0].message[0]) && (userData.chat[0].message[0].timeMsg <= receiverData.chat[0].message[0].timeMsg)){
            console.log("1")
            console.log(userData.chat[0].message[0].timeMsg)
            console.log(receiverData.chat[0].message[0].timeMsg)

            const messageDiv = 
            `<div class="message-div right">
                <p>${userData.chat[0].message[0].text}</p>
            </div>`;
                
            userData.chat[0].message.shift();
            // console.log("userData.chat[0].message.length")
            // console.log(userData.chat[0].message.length)
                
            messages.innerHTML += messageDiv;
                
            u++;
        }
        else if((userData.chat[0].message[0] && receiverData.chat[0].message[0]) && (userData.chat[0].message[0].timeMsg >= receiverData.chat[0].message[0].timeMsg)){
            console.log("1.2")
            console.log(userData.chat[0].message[0].timeMsg)
            console.log(receiverData.chat[0].message[0].timeMsg)

            const messageDiv = 
            `<div class="message-div right">
                <p>${receiverData.chat[0].message[0].text}</p>
            </div>`;
                
            userData.chat[0].message.shift();
            // console.log("userData.chat[0].message.length")
            // console.log(userData.chat[0].message.length)
                
            messages.innerHTML += messageDiv;
                
            u++;
        }
        else if(!receiverData.chat[0].message[0] && !userData.chat[0].message[0]){
            console.log("2")
            // console.log(userData.chat[0].message[0].timeMsg)
            // console.log(receiverData.chat[0].message[0].timeMsg)
            break
        }
        else if(!userData.chat[0].message[0]){
            console.log("3")
            console.log(userData.chat[0].message[0].timeMsg)
            console.log(receiverData.chat[0].message[0].timeMsg)
            
            const messageDiv = 
            `<div class="message-div left">
            <p>${receiverData.chat[0].message[0].text}</p>
            </div>`;
            
            receiverData.chat[0].message.shift();
            // console.log("receiverData.chat[0].message.length")
            // console.log(receiverData.chat[0].message.length)
            
            messages.innerHTML += messageDiv;
            
            r++
        }
        else{
            console.log("4")
            console.log(userData.chat[0].message[0].timeMsg)
            console.log(receiverData.chat[0].message[0].timeMsg)

            const messageDiv = 
            `<div class="message-div right">
            <p>${userData.chat[0].message[0].text}</p>
            </div>`;
            
            userData.chat[0].message.shift();
            // console.log("userData.chat[0].message.length")
            // console.log(userData.chat[0].message.length)
            
            messages.innerHTML += messageDiv;
    
            u++;
        }

    }
    
    userData.chat.shift();
    receiverData.chat.shift();

    i++;
}