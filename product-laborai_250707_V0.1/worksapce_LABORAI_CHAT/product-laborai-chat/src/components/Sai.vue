<template>
  <div>
    <vue-advanced-chat ref="vueAdvancedChat"
        height="calc(100vh - 20px)"
        :current-user-id="currentUserId"
        :rooms="JSON.stringify(rooms)"
        :rooms-loaded="true"
        theme="light"
        show-files="false"
        :show-footer="socketOpen?'true':'false'"
        show-emojis="false"
        :message-actions="JSON.stringify([{name: 'copy',title: '복사'},{name: 'replyMessage',title: '피드백'}])"
        :single-room="true"
            :text-messages="JSON.stringify({
            ROOMS_EMPTY: '대화가 없습니다',
            ROOM_EMPTY: '선택된 대화가 없습니다',
            NEW_MESSAGES: '새 메시지',
            MESSAGE_DELETED: '이 메시지는 삭제되었습니다',
            MESSAGES_EMPTY: '메시지가 없습니다',
            CONVERSATION_STARTED: '대화가 시작된 날짜: ',
            TYPE_MESSAGE: '사내규정에 대해서 궁금한 내용을 물어보세요.',
            SEARCH: '검색',
            IS_ONLINE: '온라인 상태입니다',
            LAST_SEEN: '마지막 접속: ',
            IS_TYPING: '입력 중...',
            CANCEL_SELECT_MESSAGE: '선택 취소'
        })"
        :messages="JSON.stringify(messages)"
        :messages-loaded="messagesLoaded"
        @message-action-handler="messageActionHandler($event.detail[0],$event.detail[1],$event.detail[2])"
        @send-message-reaction="sendMessageReaction($event.detail[0])"
        @send-message="sendMessage($event.detail[0])"
        @fetch-messages="fetchMessages($event.detail[0])"
    >

      <div slot="message_typing" id="wave">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
      </div>

    </vue-advanced-chat>


  </div>
</template>

<script>
import {register} from 'vue-advanced-chat'
import Cookies from 'js-cookie'; // js-cookie 라이브러리 임포트

register()

export default {
  data() {
    return {
      currentUserId: '1234',
      rooms: [
        {
          roomId: '1',
          roomName: 'AI경비규정',
          avatar: require('@/assets/imgs/sai_icon.svg'),
          users: [
            {
              _id: 'sai',
              username: "사이",
              avatar: require('@/assets/imgs/sai_icon.svg'),
              status: {
                state: "online",
              },
            },
           /* {
              _id: 4321,
              username: "John Snow",
              avatar: "assets/imgs/snow.png",
              status: {
                state: "offline",
                lastChanged: "14 July, 20:00",
              },
            },*/
          ],
        }
      ],
      messages: [],
      messagesLoaded: false,
      socket: null,
      socketOpen : true,
    }
  },

  mounted() {
    this.connectWebSocket();  // 컴포넌트가 마운트되면 WebSocket 연결 시작
  },

  methods: {
    // WebSocket 연결 설정 및 JWT 토큰 인증
    connectWebSocket() {
      let self = this;

      //파라미터로 JWT 토큰을 가져옴
      const token = this.$route.query.token;
      if (token!=null){
        Cookies.set('token', token, { expires: 1 });
      }
      this.socket = new WebSocket(`ws://localhost:8082/api/ai/sai?token=${Cookies.get('token')}`);
      //this.socket = new WebSocket(`ws://dev.strategygate.biz:8885/api/ai/sai?token=${Cookies.get('token')}`);

      // URL에서 /token=? 부분을 제거
      this.$router.replace({ path: '/sai', query: null });

      this.socket.onopen = () => {
        console.log("WebSocket connected");
        this.fetchChatHistory();  // 연결된 후 대화 이력 요청
      };

      this.socket.onmessage = (event) => {
        const $data = JSON.parse(event.data);
        this.handleIncomingMessage($data);  // 서버에서 받은 메시지 처리
      };

      this.socket.onerror = (error) => {
        //console.log('연결에 실패 하였습니다. 잠시 후 다시 시도해 주세요');
        //console.error("WebSocket error:", error);

        this.socketOpen=false;
        this.messages.push({
          _id : '9999',
          system: true,
          content: '정상적으로 로그인 해주세요.',
          senderId: 'system',
          timestamp: new Date(),
          date: new Date()
        });
      };

      this.socket.onclose = () => {
        console.log("WebSocket connection closed");
      };
    },

    // 대화 이력 요청
    fetchChatHistory() {
      if (this.socket.readyState === WebSocket.OPEN) {
        const message = {
          action: "getChatHistory"
        };
        this.socket.send(JSON.stringify(message));
      }
    },

    // 서버로부터 받은 메시지 처리 및 UI 업데이트
    handleIncomingMessage(data) {
      let self = this;
      if (data.action === 'getChatHistory') {
          self.currentUserId = data.authUser.userId;
          self.roomId = data.roomId;
          self.rooms[0].users.push({
            _id : data.authUser.userId,
            username : data.authUser.userNm
          });
      }

      let messages = data.messages;
      messages = messages.map(function(e){
        //alert(e.senderId)
        if(e.senderId==='sai'){
          e.avatar = require('@/assets/imgs/sai_icon.svg');
        }else{
          e.avatar = require('@/assets/imgs/person.svg');
        }
        return e;
      });
      //console.log(messages)

      //alert(messages[messages.length-1]._id);
      if (data.action === 'sendMessage') {
        if (messages[messages.length-1]._id != 'typing'){
          this.messages  = this.messages.filter(e=>{
            return e._id!='typing';
          });
        }
      }

      this.messages = [...this.messages, ...messages];
      this.messagesLoaded = true;
    },

    // 사용자가 메시지를 보냈을 때 처리
    sendMessageReaction({ roomId, messageId, reaction, remove }) {
      //alert(remove)
      let self = this;
      if (!remove){
        remove = false;
      }
      const message = {
        _id: messageId,
        reaction: reaction.unicode,
        remove: remove,
        senderId : self.currentUserId,
        timestamp: new Date().toString().substring(16, 21),
        date: new Date().toDateString()
      };

      this.messages = this.messages.map(function (message) {
        if (message._id === messageId){
          if (!remove){
            if (message.reactions[reaction.unicode]){
              message.reactions[reaction.unicode] = [...message.reactions[reaction.unicode], self.currentUserId];
            }else{
              message.reactions[reaction.unicode] = [self.currentUserId];
            }
          }else{
            message.reactions[reaction.unicode] = message.reactions[reaction.unicode].filter(senderId=>{
              return senderId!=self.currentUserId;
            });
          }
        }
        return message;
      });

      // WebSocket을 통해 서버로 메시지 전송
      if (this.socket.readyState === WebSocket.OPEN) {
        const messagePayload = {
          action: "sendMessageReaction",
          message: message,
          roomId: self.roomId  // 방 ID
        };
        this.socket.send(JSON.stringify(messagePayload));
      }
    },
    sendMessage(message) {
      let self = this;
      let _id = '';
      if (message.replyMessage!=null){
        _id = message.replyMessage._id;
      }

      const now = new Date();
      // 연도, 월, 일 가져오기
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1, 두 자릿수 맞추기
      const day = String(now.getDate()).padStart(2, '0'); // 두 자릿수 맞추기
      const formattedDate = `${year}.${month}.${day}`;

      // 시간과 분 가져오기
      const hours = String(now.getHours()).padStart(2, '0');  // 두 자릿수 맞추기
      const minutes = String(now.getMinutes()).padStart(2, '0');  // 두 자릿수 맞추기
      const formattedTime = `${hours}:${minutes}`;
      const newMessage = {
        _id: _id,
        content: message.content,
        senderId: self.currentUserId,
        avatar : require('@/assets/imgs/person.svg'),
        timestamp: formattedTime,
        date: formattedDate
      };

      //새글
      if (_id==''){
        this.messages = [...this.messages, newMessage];

      }else{//피드백
        this.messages = this.messages.map(function(e){
          if(e._id == _id){
            e.replyMessage = {
              content: message.content,
              senderId: self.currentUserId,
            }
          }
          return e;
        });
      }

      // WebSocket을 통해 서버로 메시지 전송
      if (this.socket.readyState === WebSocket.OPEN) {
        const messagePayload = {
          action: 'sendMessage',
          message: newMessage,
          roomId: self.roomId  // 방 ID
        };
        this.socket.send(JSON.stringify(messagePayload));
      }
    },

    // 메시지 페이징 처리
    fetchMessages({options = {}}) {
      //console.log(options)
      setTimeout(() => {
        if (options.reset) {
          this.messages = this.addMessages(true);
        } else {

          this.messages = [...this.addMessages(), ...this.messages];
          this.messagesLoaded = true;
        }
      });
    },

    messageActionHandler({ roomId, action, message }) {
      let self = this;
      switch (action.name) {
        case 'copy':
          // call a method to add a message to the favorite list
          self.$copyText(message.content).then(() => {
            //  alert("복사 완료")
          });

              break;
        case 'shareMessage':
          // call a method to share the message with another user
              break;
      }
    },

    addMessages(reset) {
      let messages = [];

      //alert(1);
     /* messages=[
        {
          _id: '7890',
          indexId: 12092,
          content: 'Message 1',
          senderId: '1234',
          username: 'John Doe',
          avatar: 'assets/imgs/doe.png',
          date: '13 November',
          timestamp: '10:20',
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: true,
          disableActions: false,
          disableReactions: false,
          files: [
            {
              name: 'My File',
              size: 67351,
              type: 'png',
              audio: true,
              duration: 14.4,
              url: 'https://firebasestorage.googleapis.com/...',
              preview: 'data:image/png;base64,iVBORw0KGgoAA...',
              progress: 88
            }
          ],
          reactions: {
            '😁': [
              '1234', // USER_ID
              '4321'
            ],
            '🥰': [
              '1234'
            ]
          },
          replyMessage: {
            content: 'Reply Message',
            senderId: '4321',
            files: [
              {
                name: 'My Replied File',
                size: 67351,
                type: 'png',
                audio: true,
                duration: 14.4,
                url: 'https://firebasestorage.googleapis.com/...',
                preview: 'data:image/png;base64,iVBORw0KGgoAA...'
              }
            ]
          },
        }
      ];*/


      return messages;
    }
  }
}
</script>

<style>

body {
  font-family: 'Quicksand', sans-serif;
}

html, body {
	margin:0;
	padding:0;
}

body {
	background:#F6F7F8;
}

div#wave {
	text-align:center;
	width:100px;
	.dot {
		display:inline-block;
		width:12px;
		height:12px;
		border-radius:50%;
		margin-right:3px;
		background:#303131;
		animation: wave 1.3s linear infinite;

		&:nth-child(2) {
			animation-delay: -1.1s;
		}

		&:nth-child(3) {
			animation-delay: -0.9s;
		}
	}
}

@keyframes wave {
	0%, 60%, 100% {
		transform: initial;
	}

	30% {
		transform: translateY(-15px);
	}
}

.vac-card-info{
  display: none!important;
}
</style>
