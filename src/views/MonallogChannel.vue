<template>
    <div class="monallog-channel">
        <m-line-area
            ref="lineArea" />
        <m-music-player
            :playlist="chOptions.playlist"
            :mode="{isRandom: true, isLoop: false}"
            v-if="turnOnAudio"
            @music-info="showMusicInfo"/>
        <div class="post-line">
            <m-text-bar
                class="line-text"
                :catch-phrase="encourage"
                @enter="postLine"
                v-model="line"/>
            <button
                class="line-button"
                @click="postLine"
                @mouseenter="hasCursor = true"
                @mouseleave="hasCursor = false">
                <transition name="fade-spacing"
                    mode="out-in">
                    <img src="../assets/line-btn-icon.png"
                        class="line-button-content line-button-icon"
                        v-if="!hasText && !hasCursor"
                        key="btn-img">
                    <span class="line-button-content line-button-text"
                        :style="counterColor"
                        v-else-if="!hasCursor"
                        key="btn-counter">
                        {{ lineCount }}
                    </span>
                    <span class="line-button-content line-button-text text-post"
                        v-else
                        key="btn-text">
                        SPEAK
                    </span>
                </transition>
            </button>
        </div>
    </div>
</template>

<script>
import MTextBar from '@/components/MTextBar.vue'
import MLineArea from '@/components/MLineArea.vue'
import MMusicPlayer from '@/components/MMusicPlayer.vue'

import axios from 'axios'
import io from 'socket.io-client'

export default {
    name: 'MonallogChannel',
    components: {
        'm-line-area': MLineArea,
        'm-text-bar': MTextBar,
        'm-music-player': MMusicPlayer
    },
    data () {
        return {
            /** 소켓 객체 */
            socket: null,
            /** textbar에 입력한 텍스트 */
            line: '',
            /** 버튼 위에 커서가 존재하는지 여부 */
            hasCursor: false,
            /** 소켓이 정상적으로 연결되었는지 여부 */
            isSocketOn: false,
            /** 채널 옵션 객체 */
            chOptions: Object
        }
    },
    created () {
        this.socket = io(process.env.VUE_APP_SOCKET_SERVER)

        // subscribing event listeners
        this.socket.on('connect', () => {
            this.$refs.lineArea.pushNotice({
                msgCode: 1,
                msgType: 'notice',
                msg: '채팅 서버 연결됨.',
                timeout: 3000
            })

            this.socket.emit('join', { channel: this.$route.params.chId })

            this.isSocketOn = true
        })
        this.socket.on('disconnect', () => {
            this.$refs.lineArea.pushNotice({
                msgCode: 2,
                msgType: 'error',
                msg: '채팅 서버 연결 끊어짐.',
                timeout: 5000
            })
            this.isSocketOn = false
        })
        this.socket.on('line', (data) => {
            if (!document.hidden) { // don't get lines when page is inactive
                this.$refs.lineArea.enqueue(data.line)
            }
        })
        this.socket.on('news', (data) => { // DEBUG
            console.log(data)
        })
    },
    beforeRouteEnter (to, from, next) {
        const requestURL = process.env.VUE_APP_API_SERVER +
      'channels/' +
      to.params.chId

        axios.get(requestURL)
            .then(function (response) {
                console.log(response) // 나중에 지워!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                next(vm => { // channel view에 정상적으로 접근
                    vm.chOptions = response.data.channelOptions

                    vm.$store.dispatch('turnOnBg')
                    vm.$store.dispatch('updateBgImg', { url: vm.chOptions.backgroundURL })
                })
            })
            .catch(function (error) {
                if (error.response && error.response.status === 404) next('404') // 해당 channel 없음
                else { // 그 외의 오류처리
                    next(error)
                }
            })
    },
    beforeRouteLeave (to, from, next) {
        if (this.isSocketOn) { this.socket.close() }

        this.$store.dispatch('turnOffBg')
        next()
    },
    computed: {
        encourage: function () {
            return 'Speak your line.'
        },
        lineCount: function () {
            return this.line.length
        },
        counterColor: function () {
            const gray = 200 - this.lineCount * 5
            return {
                color: `rgb(${gray}, ${gray}, ${gray})`
            }
        },
        hasText: function () {
            return this.lineCount !== 0
        },
        turnOnAudio: function () {
            return !(this.chOptions.playlist === undefined || this.chOptions.playlist.length === 0)
        }
    },
    methods: {
        /**
         * socket 서버에 line 발송
         */
        postLine: function () {
            if (this.line && this.isSocketOn) { // 정상적으로 이벤트 발생
                this.socket.emit('line', { // Socket 서버에 아래 데이터 전송
                    line: this.line,
                    channel: this.$route.params.chId, // placeholding
                    author: '!!NotSignedUser!!' // also placeholoding
                })
                this.line = ''
            } else if (!this.line) { // 텍스트 없음
                alert('내용을 입력해주세요.')
            } else if (!this.isSocketOn) { // socketio 연결 안됨
                alert('채팅 서버가 연결되지 않았습니다.\n anteater333@github 로 문의해 주세요.')
            }
        },
        /**
         * 현재 재생 중인 음악 정보를 lineArea에 line 형식으로 출력
         */
        showMusicInfo: function (music) {
            const str = `${music.title} - ${music.by}`
            this.$refs.lineArea.enqueue(str)
        }
    }
}
</script>

<style scoped>
.monallog-channel {
    position: absolute;

    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
}

.line-area {
    position: relative;
    flex: 1;
}

.music-player {
    position: absolute;
    z-index: 5;

    bottom: 50px;
    right: 0;
}

.post-line {
    margin-top: auto;
    margin-bottom: 0.5%;

    display: flex;

    opacity: 0.75;
}

.line-text {
    flex: 1;

    margin-left: 1%;
}

.line-button {
    box-sizing: content-box;

    margin-left: 1%;
    margin-right: 1%;
    padding: 0px;

    display: flex;
    justify-content: center;

    border: 4px solid var(--white);
    border-radius: 10px;

    width: 42px;
    height: 42px;

    background-color: var(--white);
    background-position: center center;
    background-repeat: no-repeat;

    overflow: hidden;

    cursor: pointer;

    transition: 0.5s;
}

.line-button:hover {
    width: 84px;
}

.line-button:focus {
    outline: none;
}

.line-button-icon {
    flex: 0 0 0;
}

.line-button-text {
    font-size: 18px;
    text-align: center;
    line-height: 42px;
}

.text-post {
    color: var(--black);
    font-weight: bold;
}

</style>
