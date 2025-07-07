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
        :message-actions="JSON.stringify([{name: 'copy',title: '복사'},{name: 'replyMessage',title: '피드백'},{name: 'openPdf',title: 'PDF열기'}])"
        :single-room="true"
            :text-messages="JSON.stringify({
            ROOMS_EMPTY: '대화가 없습니다',
            ROOM_EMPTY: '선택된 대화가 없습니다',
            NEW_MESSAGES: '새 메시지',
            MESSAGE_DELETED: '이 메시지는 삭제되었습니다',
            MESSAGES_EMPTY: '메시지가 없습니다',
            CONVERSATION_STARTED: '대화가 시작된 날짜: ',
            TYPE_MESSAGE: '궁금한 내용을 물어보세요.',
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

      
      <div :slot="'microphone-icon_' + roomId" class="microphone-icon">
        <img src="" alt="microphone" />
      </div>

      

    </vue-advanced-chat>

    <PdfViewer
        :src="pdfSrc"
        :page="pdfPage"
        :visible="pdfVisible"
        :key="pdfKey"
        @close="closePdf"
    />
  </div>


</template>

<script>
import {register} from 'vue-advanced-chat'
import Cookies from 'js-cookie'; // js-cookie 라이브러리 임포트
import PdfViewer from '@/components/PdfViewer.vue'
import config from '@/utils/config.js'  // 환경 설정 유틸리티 임포트

register()

export default {
  components: { PdfViewer },
  data() {
    return {
      currentUserId: '1234',
      rooms: [
        {
          roomId: '1',
          roomName: 'AI노무서비스',
          avatar: require('@/assets/imgs/sai_icon.svg'),
          users: [
            {
              _id: 'sai',
              username: "노무ai",
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

      pdfSrc: '',
      pdfPage: 1,
      pdfKey: null,
      pdfVisible: false
    }
  },

  mounted() {
    // 페이지 타이틀 설정
    document.title = 'AI 노무 상담 서비스';
    
    this.connectWebSocket();  // 컴포넌트가 마운트되면 WebSocket 연결 시작
  },

  beforeDestroy() {
    // 컴포넌트 언마운트 시 WebSocket 연결 정리
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  },

  watch: {
    messagesLoaded(newVal) {
      if (newVal === true) {
        this.$nextTick(() => {
          //alert(1)
          this.decorateRenderedMessages(); // 이 시점엔 DOM이 그려졌을 확률이 높음
        });
      }
    }
  },

  methods: {
    // 페이지 타이틀 변경 메서드
    setPageTitle(title) {
      document.title = title || 'AI 노무 상담 서비스';
    },
    
    decorateRenderedMessages() {
      const markdownEls = this.$el.querySelectorAll('.vac-format-message-wrapper .markdown');

      console.log(markdownEls);

      markdownEls.forEach(el => {
        const paragraph = el.querySelector('p');
        if (!paragraph) return;

        const originalText = paragraph.textContent;

        const marker = '위 답변은 아래의 정보에서 참조하여 답변하였습니다.';
        const markerIdx = originalText.indexOf(marker);

        if (markerIdx === -1) return;

        // 문장 분리
        const mainText = originalText.substring(0, markerIdx + marker.length);
        const referenceText = originalText.substring(markerIdx + marker.length).trim();

        
        
        // 기존 내용 제거
        paragraph.innerHTML = '';

        // 앞 문장 추가
        const span = document.createElement('span');
        span.textContent = mainText + ' ';
        paragraph.appendChild(span);

        // a 태그로 감싸서 삽입
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = referenceText;
        a.style.color = '#007BFF';
        a.style.textDecoration = 'underline';

        a.addEventListener('click', (e) => {
          e.preventDefault();
          alert(`참조 문서: ${referenceText}`);
        });

        paragraph.appendChild(a);
      });
    },
        
    // WebSocket 연결 설정 및 JWT 토큰 인증
    connectWebSocket() {
      let self = this;

      // 1. token을 sessionStorage에 저장
      const token = this.$route.query.token;
      if (token != null) {
        sessionStorage.setItem('token', token);
      }

      // 2. WebSocket 연결 시 sessionStorage에서 token 사용
      const wsUrl = config.apiBaseUrl+'/ws/labor';
      const tokenFromSession = sessionStorage.getItem('token');
      
      // 토큰 검증
      if (!tokenFromSession) {
        console.error('토큰이 없습니다. 로그인이 필요합니다.');
        this.socketOpen = false;
        this.messages.push({
          _id: '9999',
          system: true,
          content: '정상적으로 로그인 해주세요.',
          senderId: 'system',
          timestamp: new Date(),
          date: new Date()
        });
        return;
      }
      
      this.socket = new WebSocket(`${wsUrl}?token=${tokenFromSession}`);
      
      // URL에서 /token=? 부분을 제거 (현재 경로 유지)
      this.$router.replace({ path: this.$route.path, query: null });

      this.socket.onopen = () => {
        console.log("WebSocket connected");
        this.fetchChatHistory();  // 연결된 후 대화 이력 요청
      };

      this.socket.onmessage = (event) => {
        try {
          const $data = JSON.parse(event.data);
          console.log($data);
          this.handleIncomingMessage($data);  // 서버에서 받은 메시지 처리
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.socketOpen = false;
        this.messages.push({
          _id: '9999',
          system: true,
          content: '연결에 실패 하였습니다. 잠시 후 다시 시도해 주세요.',
          senderId: 'system',
          timestamp: new Date(),
          date: new Date()
        });
      };

      this.socket.onclose = () => {
        console.log("WebSocket connection closed");
        this.socketOpen = false;
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
      
      // 데이터 검증
      if (!data || typeof data !== 'object') {
        console.error('유효하지 않은 데이터 형식:', data);
        return;
      }
      
      if (data.action === 'getChatHistory') {
        // authUser 데이터 검증
        if (data.authUser && data.authUser.userId && data.authUser.userNm) {
          self.currentUserId = data.authUser.userId;
          self.roomId = data.roomId;
          self.rooms[0].users.push({
            _id: data.authUser.userId,
            username: data.authUser.userNm
          });
        } else {
          console.error('authUser 데이터가 유효하지 않습니다:', data.authUser);
        }
      }

      // messages 배열 검증
      if (!data.messages || !Array.isArray(data.messages)) {
        console.error('messages 배열이 유효하지 않습니다:', data.messages);
        return;
      }

      let messages = data.messages;
      messages = messages.map(function(e) {
        if (!e || typeof e !== 'object') {
          console.error('유효하지 않은 메시지 객체:', e);
          return null;
        }
        
        if (e.senderId === 'sai') {
          e.avatar = require('@/assets/imgs/sai_icon.svg');
        } else {
          e.avatar = require('@/assets/imgs/person.svg');
        }
        return e;
      }).filter(Boolean); // null 값 제거

      if (data.action === 'sendMessage') {
        if (messages.length > 0 && messages[messages.length - 1]._id !== 'typing') {
          this.messages = this.messages.filter(e => {
            return e._id !== 'typing';
          });
        }
      }

      this.messages = [...this.messages, ...messages];
      this.messagesLoaded = true;
    },
    // 사용자가 메시지를 보냈을 때 처리
    sendMessageReaction({ roomId, messageId, reaction, remove }) {
      let self = this;
      
      // 매개변수 검증
      if (!messageId || !reaction || !reaction.unicode) {
        console.error('유효하지 않은 reaction 데이터:', { messageId, reaction });
        return;
      }
      
      if (!remove) {
        remove = false;
      }
      
      const message = {
        _id: messageId,
        reaction: reaction.unicode,
        remove: remove,
        senderId: self.currentUserId,
        timestamp: new Date().toString().substring(16, 21),
        date: new Date().toDateString()
      };

      this.messages = this.messages.map(function (message) {
        if (message._id === messageId) {
          // reactions 객체가 없으면 초기화
          if (!message.reactions) {
            message.reactions = {};
          }
          
          if (!remove) {
            if (message.reactions[reaction.unicode]) {
              message.reactions[reaction.unicode] = [...message.reactions[reaction.unicode], self.currentUserId];
            } else {
              message.reactions[reaction.unicode] = [self.currentUserId];
            }
          } else {
            if (message.reactions[reaction.unicode]) {
              message.reactions[reaction.unicode] = message.reactions[reaction.unicode].filter(senderId => {
                return senderId !== self.currentUserId;
              });
            }
          }
        }
        return message;
      });

      // WebSocket을 통해 서버로 메시지 전송
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
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
    openPdf(page, path) {  //pdf 열기
      this.pdfSrc = path
      this.pdfPage = Number(page)
      this.pdfKey = Date.now()
      this.pdfVisible = true
    },
    closePdf() { //pdf 닫기
      this.pdfVisible = false
      this.pdfSrc = ''
      this.pdfPage = 1
      this.pdfKey = null
    },
    messageActionHandler({ roomId, action, message }) {
      let self = this;
      switch (action.name) {
        case 'copy':
          // call a method to add a message to the favorite list
          self.$copyText(message.content).then(() => {
              //alert("복사 완료")
          });
              break;

        case 'shareMessage':
          // call a method to share the message with another user
              break;

        case 'openPdf':
          if(message.senderId === "sai"){
            
            console.log(message);
            //alert("sai")'
            ///pdf-proxy/는 vue.config.js에서 설정함.(CORS로 인해 설정)
            const filePath = '/pdf-proxy/sgatedev/laborai' + message.filePath;
            const page = + message.page;


            self.openPdf(page, filePath);
          }
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

<style scoped>

:deep(.vac-icon-textarea-left) {
  display: none !important;
}
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

