<template>
  <div class="container">
    <div v-if="!isFailed" class="inner">
      <p class="title">New order</p>
      <textarea placeholder="Descripton.." v-model="description"></textarea>
      <input placeholder="Address.." v-model="address">
      <div class="buttons">
        <button class="cancel btn" @click="$emit('cancel')">Cancel</button>
        <button class="submit btn" @click="showAddress">Make an order</button>
      </div>
    </div>
    <div v-if="isFailed" class="inner">
      <p>We found nothing on your request..</p>
      <p>Please, formulate your request more precisely and try again</p>
      <button class="btn center"
              style="margin: auto"
              @click="isFailed = false">OK</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

  export default {
    props: ['map'],
    name: 'NewOrder',
    data() {
      return {
        description: '',
        address: '',
        response: [],    // it must be initilized so*
        coords: [],
        isFailed: false
      }
    },
    computed: {
      isRecieved: function () {
        return (this.response.toString().length > 2)    // * when response recieved, it will be more than 2 symbols
      }
    },
    methods: {
      makeOrder: function () {
        let order = {
          address: this.address,
          description: this.description,
          latitude: this.coords[0],
          longitude: this.coords[1]
        };
        this.$emit('madeOrder', order, false);
        this.map.setCenter([order.latitude, order.longitude], 17);
      },
      showAddress: async function () {
        let self = this;
        await axios.get('https://geocode-maps.yandex.ru/1.x/?format=json&geocode='
          + this.address +'&results=1')
          .then((response) => {
            this.response = response.data.response
              .GeoObjectCollection.featureMember; // there is empty array or our response
          }).then(() => {
            if (this.isRecieved) {
              this.coords = this.response[0]
                .GeoObject.Point.pos.split(' ').reverse()
            } else {
              this.isFailed = true;
              this.address = '';
            }
          })
          .catch((error) => {
            console.log(error)
        });
        if (this.isRecieved) {
          this.$emit('cancel');
          await this.makeOrder();
        }
      }
    }
  }
</script>

<style scoped>
.container {
  margin: 25vh 8vw;
  position: absolute;
  width: 28vw;
  height: 50vh;
  background-color: #fff;
  z-index: 2;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
}
.inner {
  width: 80%;
  height: 100%;
  margin: auto;
}
.title {
  font-size: 30px;
  margin: 20px;
}
textarea, input {
  color: #2699FB;
  padding: 10px;
  width: calc(100% - 20px);
  height: 35%;
  outline: none;
  resize: none;
  border: #2699FB solid 2px;
  border-radius: 5px;
  font-size: 14px;
}
input {
  margin: 20px 0;
  height: 5%;
}
::placeholder {
  color: #BCE0FD;
}
.buttons {
  width: 100%;
  margin: auto;
}
.btn {
  width: 110px;
  border-radius: 5px;
  outline: none;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
}
.cancel {
  float: left;
  border: #2699FB solid 2px;
  background-color: #fff;
  color: #2699FB;
  padding: 12px;
}
.submit {
  float: right;
  background-color: #2699FB;
  color: #fff;
  border: none;
  padding: 14px;
}
.center {
  margin: auto;
  border: #2699FB solid 2px;
  background-color: #fff;
  color: #2699FB;
  padding: 12px;
}
</style>
