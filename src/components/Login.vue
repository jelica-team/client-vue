<template>
  <form class="container" @submit="onSubmit">
    <div class="field">
      <p>E-mail</p>
      <input type="text" placeholder="Enter your email.." v-model="form.username">
    </div>
    <div class="field">
      <p>Password</p>
      <input type="password" placeholder="Enter your password.." v-model="form.password">
    </div>
    <button type="submit">Login</button>
    <p class="link">Have not account? <router-link to="signup">Sign up</router-link></p>
  </form>
</template>

<script>
  import { authenticate } from "../helpers/index"

  export default {
    name: 'Login',
    data () {
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      onSubmit (e) {
        e.preventDefault();
        authenticate(this.form)
          .then(response => {
            // JSON responses are automatically parsed.
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_id', response.data.user.id);
            this.$router.push('/main')
          })
          .catch(e => {
            console.log(e)
          })
      }
    }
  }
</script>

<style scoped>
  .container{
    width: 360px;
    margin: 250px auto;
    color: #2699FB;
  }
  .field {
    margin: 20px 0;
  }
  p {
    font-size: 14px;
    margin: 8px 0;
    text-align: left;
    font-weight: 900;
  }
  input {
    background-color: #F1F9FF;
    color: #2699FB;
    border: 2px solid #BCE0FD;
    font-size: 14px;
    width: 316px;
    height: 16px;
    border-radius: 10px;
    padding: 15px 20px;
    outline: none;
  }
  ::placeholder {
    color: #2699FB;
  }
  button {
    color: white;
    border: none;
    margin: 20px;
    background-color: #2699FB;
    border-radius: 4px;
    width: 148px;
    font-size: 14px;
    padding: 15px;
    font-weight: 900;
    outline: none;
  }
  .link {
    margin: 20px 0;
  }
  a {
    color: #2699FB;
  }
</style>
