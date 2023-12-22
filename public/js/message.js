const userDataDiv = document.querySelector('#userData');
const receiverDataDiv = document.querySelector('#receiverData');
let messages = document.querySelector('#messages');
// console.log(messages.innerHTML)
let userData, receiverData;


if(userDataDiv.value){
    userData = JSON.parse(userDataDiv.value);
}
else{
    userData = {chat: []};
}

if(receiverDataDiv.value){
    receiverData = JSON.parse(receiverDataDiv.value);
}
else{
    receiverData = {chat: []};
}

console.log(userData);
console.log(receiverData);
// console.log(new Date().getTime());
// console.log(typeof(userData.chat[0].message[0].timeMsg));
// console.log(1699291281016 <= 1699291238406);

// setTimeout(function(){
//     window.stop();
// }, 2000);


let i = 0, u = 0, r = 0;
while(userData.chat.length != 0 || receiverData.chat.length != 0){
    let userMessage = userData.chat[0], receiverMessage = receiverData.chat[0];
    // console.log("userData.chat");
    // console.log(userData.chat);
    // console.log("receiverData.chat");
    // console.log(receiverData.chat);
    console.log("i");
    console.log(i);
    while((userMessage && userMessage.message && userMessage.message.length != 0) || (receiverMessage && receiverMessage.message && receiverMessage.message.length != 0)){
        console.log("log");
        if((!userMessage || !receiverMessage) && !(!userMessage && !receiverMessage)){
            if(!userMessage){
                const messageDiv = 
                `<div class="message-div left">
                    <p>${receiverMessage.message[0].text}</p>
                </div>`;
                    
                receiverMessage.message.shift();
                // console.log("receiverMessage.message.length")
                // console.log(receiverMessage.message.length)
                    
                messages.innerHTML += messageDiv;
                    
                u++;
            }
            else{
                const messageDiv = 
                `<div class="message-div right">
                    <p>${userMessage.message[0].text}</p>
                </div>`;
                    
                userMessage.message.shift();
                // console.log("userMessage.message.length")
                // console.log(userMessage.message.length)
                    
                messages.innerHTML += messageDiv;
                    
                u++;
            }
        }
        else if(userMessage.message[0] && receiverMessage.message[0]){
            if(userMessage.message[0].timeMsg <= receiverMessage.message[0].timeMsg){
                console.log("1")
                console.log(userMessage.message[0].timeMsg)
                console.log(receiverMessage.message[0].timeMsg)
    
                const messageDiv = 
                `<div class="message-div right">
                    <p>${userMessage.message[0].text}</p>
                </div>`;
                    
                userMessage.message.shift();
                // console.log("userMessage.message.length")
                // console.log(userMessage.message.length)
                    
                messages.innerHTML += messageDiv;
                    
                u++;

            }
            else{
                console.log("1.2")
                console.log(userMessage.message[0].timeMsg)
                console.log(receiverMessage.message[0].timeMsg)
        
                const messageDiv = 
                `<div class="message-div left">
                    <p>${receiverMessage.message[0].text}</p>
                </div>`;
                    
                receiverMessage.message.shift();
                // console.log("receiverMessage.message.length")
                // console.log(receiverMessage.message.length)
                    
                messages.innerHTML += messageDiv;
                    
                u++;

            }
        }
        else if(!receiverMessage.message[0] && !userMessage.message[0]){
            console.log("2")
            // console.log(userMessage.message[0].timeMsg)
            // console.log(receiverMessage.message[0].timeMsg)
            break
        }
        else if(!userMessage.message[0]){
            console.log("3")
            // console.log(userMessage.message[0].timeMsg)
            console.log(receiverMessage.message[0].timeMsg)
            
            const messageDiv = 
            `<div class="message-div left">
            <p>${receiverMessage.message[0].text}</p>
            </div>`;
            
            receiverMessage.message.shift();
            // console.log("receiverMessage.message.length")
            // console.log(receiverMessage.message.length)
            
            messages.innerHTML += messageDiv;
            
            r++
        }
        else if(!receiverMessage.message[0]){
            console.log("4")
            console.log(userMessage.message[0].timeMsg)
            // console.log(receiverMessage.message[0].timeMsg)

            const messageDiv = 
            `<div class="message-div right">
            <p>${userMessage.message[0].text}</p>
            </div>`;
            
            userMessage.message.shift();
            // console.log("userMessage.message.length")
            // console.log(userMessage.message.length)
            
            messages.innerHTML += messageDiv;
    
            u++;
        }

        if(!userMessage && !receiverMessage){
            break;
        }

    }
    
    userData.chat.shift();
    receiverData.chat.shift();

    if(!userData.chat && !receiverData.chat){
        break;
    }

    i++;
}