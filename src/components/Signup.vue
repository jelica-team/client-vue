<template>
  <div class="container">
    <h1>Зарегестрироваться в Jelica.</h1>
    <input type="text" placeholder="Введите Ваше имя" v-model="name">
    <input type="text" placeholder="Введите email" v-model="email">
    <input type="text" placeholder="Введите пароль" v-model="password">
    <input type="text" placeholder="Повторите пароль" v-model="checkedPassword">
    <button @click="submit">Зарегестрироваться</button>
  </div>
</template>

<script>
import { register, login } from "../helpers";

export default {
  name: 'Signup',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      checkedPassword: ''
    }
  },
  computed: {
    isReadyToSubmit: function () {
      return this.password === this.checkedPassword
      && this.name && this.email && this.password
    }
  },
  methods: {
    submit: function () {
      register(this.email, this.password).then(res => {
        localStorage.setItem('example-jwt-jwt', res.data)
        this.$router.push('/')
      })
    }
  }
}
</script>

<style scoped>
  .container {
    width: 60%;
    margin: auto;
  }
  input {
    width: 60%;
    margin: 10px auto;
  }
  button {
    margin: 10px 25%;
  }
</style>
