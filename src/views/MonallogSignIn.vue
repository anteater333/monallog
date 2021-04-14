<template>
    <div class="monallog-sign-in">
        <div class="monallog-sign-in-text-layout">
            <m-text-bar
                class="sign-in-text user-email"
                ref="emailText"
                v-model="userEmail"
                placeholder="Your email"
                type="email"/>
            <m-text-bar
                class="sign-in-text user-password"
                placeholder="Your password"
                v-model="userPwd"
                type="password"/>
        </div>
        <m-button>
            Sign In
        </m-button>
    </div>
</template>

<script>
import MTextBar from '@/components/MTextBar.vue'
import MButton from '@/components/MButton.vue'

export default {
    name: 'MonallogSignIn',
    components: {
        'm-text-bar': MTextBar,
        'm-button': MButton
    },
    data () {
        return {
            userEmail: '',
            userPwd: ''
        }
    },
    mounted () {
        this.$refs.emailText.focus()
    },
    computed: {
    },
    methods: {
    }
}
</script>

<style scoped>
.monallog-sign-in {
    position: absolute;

    display: flex;
}

.monallog-sign-in .sign-in-text {
    width: 50vw;
    margin: 1rem;
    position: flex;
}

.home-content {
    position: absolute;
    top: 35vh;

    width: 100%;

    opacity: 0.75;
}

.main-logo {
    margin-bottom: 5vh;
}

.search {
    margin: auto;

    max-width: 457px;
    height: 42px;

    padding: 0px 20px;

    opacity: 0.75;
}
</style>
