<template>
  <div class="container">
    <h1>Rate completed order</h1>
    <p>One of your order was made by {{ name }}.</p>
    <p>Please rate his work so that other users can know more about him!</p>
    <p>Some details about the order: {{ details }}</p>
    <div class="score">
      <div class="star" v-for="(star, index) in stars"
            @mouseenter="setStar(index)"
            @mouseout="unsetStar"
            @click="setMark(index + 1)"
      >
        <img src="../assets/good-star.png" alt="." v-if="star">
        <img src="../assets/bad-star.png" alt="." v-else="star">
      </div>
    </div>
  </div>
</template>

<script>
  import { getUser } from "../helpers";

  export default {
    name: "rate-window",
    props: ['client', 'details'],
    data () {
      return {
        name: '',
        stars: [false, false, false, false, false]
      }
    },
    mounted () {
      this.nameById();
    },
    computed: {
      restStars: function () {
        return 5 - this.score;
      }
    },
    methods: {
      nameById: function () {
        getUser(this.client).then(res => {
          this.name = res.data[0].username;
        })
      },
      setStar: function (starNumber) {
        for (let i = 0; i <= starNumber; ++i) {
          this.$set(this.stars, i, true);
        }
      },
      unsetStar: function () {
        this.stars = [false, false, false, false, false];
      },
      setMark: function (mark) {
        this.$emit('marked', mark);
      }
    }
  }
</script>

<style scoped>
  .container {
    margin: 22vh -8vw;
    position: absolute;
    width: 60vw;
    height: 56vh;
    background-color: #fff;
    z-index: 2;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }
  .score {
    margin: 30px;
    max-height: 30px;
    display: -webkit-inline-box;
  }
  .star {
    width: 70px;
    height: 70px;
    margin: 10px;
  }
  h1 {
    margin: 35px;
  }
  p {
    font-size: 18px;
  }
  img {
    height: 100%;
    width: 100%;
    cursor: pointer;
  }
</style>
