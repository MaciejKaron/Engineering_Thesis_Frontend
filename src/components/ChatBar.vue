<template>
<div class="chatButton-switch" v-if="currentUser">
<div class="chatButton" v-if="!$props.openChat">
    <button id="chatB" @click="$emit('toggleChat') ; getConversationFriends()"><font-awesome-icon size="2x" icon="comment-dots" /></button>
</div>
</div>
<div class="chatbar" v-if="$props.openChat">
    <div class="container">
        <div class="row h-10">
            <div class="close-chat">
                <button id="close" @click="$emit('toggleChat')">X</button>
            </div>
        </div>
        <div class="row h-90" id="Chat-window" >
            <div class="col-4" id="conversations-list">
                <p>Conversations</p>
                <ul>
                    <li 
                    :class="{ active: index == currentIndex}" 
                    v-for="(friend,index) in conversationFriends"
                    :key="index"
                    @click="setActiveConversation(friend, index)">

                    {{friend.username}}

                    </li>
                </ul>
            </div>
            <div class="col-8" id="right-side-chat-window"> 
                <div class="row h-70" id="messages">
                    <div class="col-12" id="messages-column">
                <span id="noConversation" v-if="!currentChat">Open a conversation to start a chat</span>
                <div v-for="(message,index) in messages"
                :key="index">
                    <div class="currentTexter" v-show="message.sender === thisCurrentUser._id && currentChat">
                        {{message.text}}
                        <div class="data">
                        {{displayDate(message.createdAt)}}
                        </div>
                    </div>
                    <div class="otherTexter" v-show="message.sender !== thisCurrentUser._id && currentChat">
                        {{message.text}}
                        <div class="data">
                        {{displayDate(message.createdAt)}}
                        </div>
                    </div>
                </div>
                    </div>
                </div>
                <div class="row h-20" id="message-input" v-if="currentChat">
                    <div class="col-12">
                        <div class="message-area">
                        <div class="message-a">
                            <textarea class="form-control" id="text-area" v-model="newMessage" rows="3" placeholder="Your message ..."></textarea>
                        </div>
                        <div class="button-a">
                            <button class="send-message" @click="createMessage(); sendMessageSocket()">Send</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import userService from "@/services/user.service";
import conversationService from "@/services/conversation.service"
import messageService from "@/services/message.service";
import moment from "moment"
import socketioService from "@/services/socketio.service"
export default {
    props: [
        'openChat'
    ],
    emits: [
        "toggleChat"
    ],
    name: "ChatBar-comp",
    data() {
        return {
            thisCurrentUser: [],
            conversations: [],
            conversationFriend: [],
            conversationFriends: [],
            currentChat: null,
            messages: [],
            newMessage: "",
            ownMessages: [],
            messageDate: null,
            thisUser: null,
            currentIndex: -1,
            socket: null,
            arrivalMessage: [],
        }
    },
    methods: {
        //get current user
          getOneCurrentUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisCurrentUser = response.data
                    // console.log(this.thisCurrentUser)
                })
                .catch(e => {
                console.log(e)
            })
        },
        //get current user conversations
        getCurrentUserConversations(id) {
            conversationService.getConversation(id)
                .then(response => {
                    this.conversations = response.data
                console.log(this.conversations)
                })
                .catch(e => {
                console.log(e)
            })
        },
        //get current chat
        getCurrentChat(id1, id2) {
            conversationService.getCommonConversation(id1, id2)
                .then(response => {
                    this.currentChat = response.data
                    this.getMessages(this.currentChat._id)
                    this.scrollToBottom()
                    // console.log(this.currentChat)
                })
                .catch(e => {
                console.log(e)
            })
        },
        //get conversation friends ids
        getConversationFriends() {
            for (var i = 0; i < this.conversations.length; i++){
                   const friendId = this.conversations[i].members.find((m) => m !== this.currentUser._id)

                 userService.findOneUser(friendId)
                     .then(response => {
                         this.conversationFriend = response.data
                         if (this.conversationFriends.length < this.conversations.length) {
                             this.conversationFriends.push(this.conversationFriend)
                             console.log(this.conversationFriends)
                         }
            })
            } 
        },
         setActiveConversation(friend, index) {
            this.thisUser = friend
             this.currentIndex = index
             this.getCurrentChat(this.thisUser._id, this.currentUser._id)
        },

        getMessages(id) {
            messageService.getMessage(id)
                .then(response => {
                    this.messages = response.data
                    //AFTER SELECT CURRENT CHAT - SCROLL TO BOTTOM
                    this.$nextTick(function () {
                    var container = document.querySelector(".row.h-70")
                    container.scrollTop = container.scrollHeight
                     })
            })
        },
        createMessage() {
            var data = {
                sender: this.currentUser._id,
                text: this.newMessage,
                conversationId: this.currentChat._id
            }  
            messageService.createMessage(data)
                .then(response => {
                    this.getCurrentChat(this.thisUser._id, this.currentUser._id)
                    this.$watch('messages', () => {
                        this.scrollToBottom()
                    })
                    this.getMessages(this.currentChat._id)
                    this.messageDate = response.data.createdAt
                    this.newMessage = ""
                    console.log(response.data)
                })
                
        },

        sendMessageSocket() {
            //check every currentChat memer and if it's this member wchich userId is not equal current user id == our friend
            const receiverId = this.currentChat.members.find((member) => member !== this.currentUser._id)
            socketioService.socket.emit("sendMessage", {
                senderId: this.currentUser._id,
                receiverId,
                text: this.newMessage,
                createdAt: this.messageDate
            })
        },

        getMessageSocket() {
            socketioService.socket.on("getMessage", (data) => {
                this.messages.push({
                    sender: data.senderId,
                    text: data.text,
                    createdAt: data.createdAt
                })   
                this.$nextTick(function () {
            var container = document.querySelector(".row.h-70")
            container.scrollTop = container.scrollHeight
          })        
            })
        },
        changeArrays() {
            if (this.arrivalMessage) {
                console.log('123')
                
                if (this.currentChat.members.includes(this.arrivalMessage.sender)) {
                    this.messages = [...this.messages, this.arrivalMessage]
                    // this.messages((prev) => [...prev, this.arrivalMessage])
                    console.log('321')
                    console.log(this.arrivalMessage)
                    console.log(this.messages)
            }
            }  
        },
        displayDate(value) {
            if (value) {
                 return moment(String(value)).format('MM.DD.YYYY hh:mm a')
            }
        },
        scrollToBottom() {
            var container = document.querySelector(".row.h-70")
            container.scrollTop = container.scrollHeight
            // document.getElementById("messages-column").scrollIntoView({ behavior: 'smooth', block: 'end' })
        },
        log(message) {
            console.log(message)
        },
        testSocket() {
       console.log(socketioService.socket.current);
        },
        addUserSocket() {
            socketioService.socket.emit("addUser", this.currentUser._id)
            socketioService.socket.on("getUsers", () => {  // (users)
                // console.log(users)
            })
        },
    },
    mounted() {
        this.getOneCurrentUser(this.currentUser._id)
        this.getCurrentUserConversations(this.currentUser._id)
        this.addUserSocket()
        this.getMessageSocket()
    },
    created() {
        socketioService.setupSocketConnection()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        }
    },
}
</script>

<style>
.chatButton{
    float: right;
   display: flex;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    width: 3em;
    height: 3em;
    top: 42em;
    right: 2em;
    background-color: rgb(184, 65, 186);  
    z-index: 20;
}

#chatB {
    width:3em;
    height: 3em;
}

.chatbar{
   float: right;
   display: flex;
    justify-content: flex-start;
    position: absolute;
    width: 50em;
    height: 25em;
    top: 22em;
    right: 2em;
    background-color: rgb(184, 65, 186);  
    z-index: 19; 
}

.close-chat{
    width:50em;
    height:2em;
    background-color: rgb(215, 33, 218);
}

#close{
     float: right;
}

.col-4{
    border-right: 1px solid #000;
}

#noConversation{
    position: absolute;
    top:20%;
    font-size: 48px;
    text-align: center;
    color: rgb(182, 181, 181);
}

.currentTexter{
    text-align: right;
}

.otherTexter{
    text-align: left;
}



#message-input{
    text-align: center;
}

.container{
    height: 100%;
}

.h-10{
    height: 10%;
}

.h-90{
    height: 90%;
}

.h-70{
    overflow-y:scroll;
    overflow-x:hidden;
    height:16em;
}

.h-20{
    height: 20%;
}

.message-area{
    margin-top: 1em;
    width: 100%;
  text-align: center;
}

.message-a{
    width: 80%;
display: inline-block;
  vertical-align: middle;
}

.button-a{
    width: 20%;
display: inline-block;
  vertical-align: middle;
}

.data{
    font-size: 12px;
    color: rgb(44, 44, 44);
}

</style>