<template>
    <div class="music-player">
        <audio autoplay
            ref="audioCtrl"
            v-if="hasMusic"
            @play="emitMusicInfo()"
            @ended="nextTrack()">
            <source :src="nowPlaying.URL"
            type="audio/mpeg">
        </audio>
        <span
            class="music-control-note"
            :class="{ paused: isPaused }"
            @click="pause()">
            ♪
        </span>
    </div>
</template>

<script>
export default {
    name: 'MMusicPlayer',
    props: {
        playlist: Array,
        mode: {
            isRandom: Boolean,
            isLoop: Boolean
        }
    },
    data () {
        return {
            index: 0,
            playingOrder: Array,
            isPaused: false
        }
    },
    computed: {
        /**
         * 현재 재생 곡 정보
         */
        nowPlaying: function () {
            let music
            if (this.playingOrder === undefined || this.playingOrder.length === 0) {
                music = { URL: '', title: '', by: '' }
            } else {
                music = this.playlist[this.playingOrder[this.index]]
            }
            return music
        },
        /**
         * Playlist가 음악을 가지고 있는지 여부
         */
        hasMusic: function () {
            if (this.playlist.length === 0) {
                return false
            }
            return true
        }
    },
    created () {
        this.playingOrder = [...Array(this.playlist.length).keys()]
        if (this.mode.isRandom) {
            this.shuffle()
        }
    },
    methods: {
        /**
         * 다음 트랙 재생
         */
        nextTrack: function () {
            const ctrl = this.$refs.audioCtrl

            this.index += 1

            // 플레이리스트를 모두 재생했는지 확인
            if (this.index >= this.playlist.length) {
                // index 초기화
                this.index = this.index % this.playlist.length
                // 루프 모드가 아님
                // 랜덤 여부에 따라 리스트 셔플 후 재생 정지
                if (!this.mode.isLoop) {
                    if (this.mode.isRandom) {
                        this.shuffle()
                    }
                    ctrl.load()
                    return this.pause()
                }
            }

            ctrl.load()
            ctrl.play()
        },
        emitMusicInfo: function () {
            // 상위 컴포넌트에게 music-info 이벤트 발생
            this.$emit('music-info', this.nowPlaying)
        },
        pause: function () {
            if (!this.isPaused) {
                this.$refs.audioCtrl.pause()
                this.isPaused = true
            } else {
                this.$refs.audioCtrl.play()
                this.isPaused = false
            }
        },
        shuffle: function () {
            this.playingOrder = this.playingOrder
                .map(a => [Math.random(), a])
                .sort((a, b) => a[0] - b[0])
                .map(a => a[1])
        }
    }
}
</script>

<style scoped>
.music-player {
    width: fit-content;
    margin: 1%;
}

.music-control-note {
    user-select: none;

    font-size: 4rem;
    font-weight: bolder;
    cursor: pointer;

    opacity: 0.2;

    transition: all 3s ease-in-out;
}

.music-control-note:hover {
    opacity: 0.75;

    transition: all .7s ease-in-out;
}

.music-control-note.paused {
    opacity: 0;

    transition: all 1s ease-in-out;
}

.music-control-note.paused:hover {
    opacity: 0.1;

    transition: all .7s ease-in-out;
}
</style>
