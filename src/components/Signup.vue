<template>
  <form class="container" @submit="onSubmit">
    <div class="field">
      <p>Name</p>
      <input type="text" placeholder="Enter your name.." v-model="form.username">
    </div>
    <div class="field">
      <p>E-mail</p>
      <input type="email" placeholder="Enter your email.." v-model="form.email">
    </div>
    <div class="field">
      <p>Phone</p>
      <input type="tel" placeholder="Enter your phone number.." v-model="form.phone">
    </div>
    <div class="field">
      <p>Password</p>
      <input type="password" placeholder="Enter your password.." v-model="form.password">
    </div>
    <div class="field">
      <p>Confirm password</p>
      <input type="password" placeholder="Confirm password.." v-model="form.confirm_password">
    </div>
    <button type="submit">Sign up</button>
    <p class="link">Have account? <router-link to="login">Log in</router-link></p>
  </form>
</template>

<script>
  import { seedUser } from "../helpers"

  export default {
    data () {
      return {
        form: {
          email: '',
          username: '',
          password: '',
          confirm_password:'',
          phone: ''
        }
      }
    },
    methods: {
      onSubmit (e) {
        e.preventDefault();
        seedUser(this.form)
          .then(response => {
            // JSON responses automatically parsed.
            this.form = response.data;
            if (this.form.status === 200)
              this.$refs.modal.show()
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
    margin: 100px auto;
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
