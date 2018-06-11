<template>
  <div class="container">
    <div class="photo">
      <img src="../assets/profile.png" alt="icon">
    </div>
    <div class="info">
      <h2>{{ name }}</h2>
      <div class="phone">
        <img src="../assets/phone.png" alt="phone: ">
      </div>
      <span>{{ phone }}</span>
      <div class="score">
        <div class="good star" v-for="star in score">
          <img src="../assets/good-star.png" alt=".">
        </div>
        <div class="bad star" v-for="star in restStars">
          <img src="../assets/bad-star.png" alt=".">
        </div>
      </div>
      <button class="order-button btn" @click="close">Close</button>
      {{ res }}
    </div>
  </div>
</template>

<script>
  import { getUser } from "../helpers";

  export default {
    name: "Profile",
    props: ['user_id'],
    data () {
      return {
        name: '',
        phone: '',
        score: 0,
        res: ''
      }
    },
    mounted: function () {
      this.fetchStats()
    },
    computed: {
      restStars: function () {
        return 5 - this.score
      }
    },
    methods: {
      close: function () {
        this.$emit('close');
      },
      fetchStats: function () {
        getUser(this.user_id).then(response => {
          this.name = response.data[0].username;
          this.phone = response.data[0].phone;
          this.score = response.data[0].rating;
        });
      }
    }
  }
</script>

<style scoped>
.container {
  margin: 30vh 11vw;
  position: absolute;
  width: 50vw;
  height: 23vw;
  background-color: #fff;
  z-index: 2;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
}
.photo {
  width: calc(23vw - 30px);
  height: calc(100% - 30px);
  margin: 15px;
  display: inline-block;
}
.info {
  width: calc(27vw - 15px);
  margin: 15px 15px 15px 0;
  float: right;
}
.phone {
  width: 30px;
  height: 30px;
  margin: 0;
  display: inline-block;
}
.score {
  margin: 30px;
  max-height: 30px;
  display: -webkit-inline-box;
}
.star {
  width: 30px;
  height: 30px;
  margin: 1px;
}
.order-button {
  padding: 14px 22px;
  float: left;
  color: white;
  font-size: 12px;
  font-weight: bold;
  background-color: #2699FB;
  border: none;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}
.btn {
  padding: 7px 11px;
  margin: 8px 0;
  float: right;
}
img {
  height: 100%;
  width: 100%;
  cursor: pointer;
}
span {
  margin: 15px;
}
</style>
