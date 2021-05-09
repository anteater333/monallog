<template>
    <div class="monallog-sign-in">
        <div class="monallog-sign-in-text-layout">
            <v-text-field
                class="sign-in-text user-email"
                label="Your email"
                hide-details="auto"
                v-model="userEmail"
                ref="emailText"
                type="email"
                color="rgb(255,255,255)"
                @keyup.enter="signInRequest" />
            <v-text-field
                class="sign-in-text user-password"
                label="Your password"
                hide-details="auto"
                v-model="userPwd"
                ref="pwdText"
                type="password"
                color="rgb(255,255,255)"
                @keyup.enter="signInRequest" />
            <v-btn
                class="sign-in-btn"
                ref="signInBtn"
                outlined
                @click="signInRequest">
                Sign In
            </v-btn>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: 'MonallogSignIn',
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
        signInRequest: function() {
            if (this.userEmail === "") {
                this.invalidEmail()
                return
            }
            if (this.userPwd === "") {
                this.invalidPwd()
                return
            }

            const reqURI = process.env.VUE_APP_API_SERVER
                + '/auth/login'
            const reqBody = {
                email: this.userEmail,
                password: this.userPwd
            }

            this.$refs.signInBtn.loading = true
            axios.post(reqURI, reqBody)
                .then((response) => {
                    alert('do something')
                })
                .catch((err) => {
                    alert(err)
                })
                .finally(() => {
                    this.$refs.signInBtn.loading = false
                    console.log('finally')
                })
        },
        invalidEmail: function () {
            this.$refs.emailText.error = true
        },
        invalidPwd: function () {
            this.$refs.pwdText.error = true
        }
    }
}
</script>

<style scoped>
.monallog-sign-in {
    position: absolute;
    top: 0;
    bottom: 5vh;
    right: 0;
    left: 0;
    margin: auto;

    display: flex;
    align-items: center;
    justify-content: center;
}

.monallog-sign-in .sign-in-text {
    width: 20vw;
    margin: 1rem;
    position: flex;
}

.sign-in-btn {
    margin: 1rem;
    opacity: 0.5;
}
</style>
