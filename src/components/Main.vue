<template>
  <div class="container">
    <div class="panel">
      <div class="inner">
        <div class="header">
          <button class="order-button" @click="newOrderIsOpened = !newOrderIsOpened">Make new order</button>
          <div class="icon">
            <img src="../assets/profile.png" alt="icon">
          </div>
        </div>
        <div class="orders">
          <div v-for="order in orders" @click="goToPlace(order.coords)" class="order">
            <div class="head">
              <div class="user">
                <img src="../assets/profile.png" alt="icon">
              </div>
              <span class="user-name">{{ order.userName }}</span>
              <p class="time">{{ setTime(order.time) }}</p>
            </div>
            <p class="description">{{ order.description }}</p>
            <div class="location">
              <div style="width: 10px">
                <img src="../assets/location.png" alt="location: ">
              </div>
              <p>{{ order.address }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="mask"
         v-if="newOrderIsOpened"
         @click="newOrderIsOpened = false"
         ></div>
    <div id="map">
      <NewOrder
        v-if="newOrderIsOpened"
        :map="myMap"
        @cancel="newOrderIsOpened = false"
        @madeOrder="saveOrder"
      />
    </div>
  </div>
</template>

<script>
import NewOrder from './NewOrder'

export default {
  name: 'MainPage',
 // props: ['user'],
  components: {
    NewOrder
  },
  data () {
    return {
      user: 'Some Guy',
      orders: [{
        userName: 'Roman Mazeev',
        time: 1526481455008,
        description: 'Please, bring me one cup of coffee, I will give you 100 roubles and you can keep a change to you',
        address: 'Вяземский пер., 5-7',
        coords: [59.972981584288235, 30.302002656366767]
      },
        {
          userName: 'Sergey Novikov',
          time: 1526667201995,
          description: 'I hate russians! Please, buy for me one ticket to Spain..',
          address: 'ул. Ломоносова, 9',
          coords: [59.926971, 30.338033]
        }],
      myMap: null,
      myClusterer: null,
      newOrderIsOpened: false
    }
  },
  mounted: function () {
    this.initMap(13, [59.9342092, 30.324571]);
    this.addAll();
  },
  methods: {
    initMap: function (zoom, center) {
      let self = this;
      ymaps.ready(init);

      function init(){
        self.myMap = new ymaps.Map("map", {
          center: center,
          zoom: zoom
        });
        self.myClusterer = new ymaps.Clusterer();
      }
    },
    addPlacemark: function(order) {
      let self = this
      ymaps.ready(add);

      function add() {
        let pm = new ymaps.Placemark(order.coords, {
          hintContent: order.userName,
          balloonContent: order.description
        })
        self.myClusterer.add(pm);
        self.myMap.geoObjects.add(self.myClusterer);
      }
    },
    addAll: function () {
      for (let i = 0; i < this.orders.length; ++i) {
        this.addPlacemark(this.orders[i])
      }
    },
    goToPlace: function (coords) {
      this.myMap.setCenter(coords, 17)
    },
    setTime: function (time) {
      let period = Date.now() - time;
      let seconds = period / 1000;
      let minutes = seconds / 60;
      let hours = minutes / 60;
      let days = hours / 24;
      if (seconds < 1) return 'just now';
      if (minutes < 1) return Math.floor(seconds) +
        ((seconds >= 2) ? ' seconds' : 'second') + ' ago';
      if (hours < 1) return Math.floor(minutes) +
        ((minutes >= 2) ? ' minutes' : 'minute') + ' ago';
      return (days < 1) ? Math.floor(hours) +
        ((hours >= 2) ? ' hours' : ' hour') + ' ago' : Math.floor(days) +
        ((days >= 2) ? ' days' : ' day') + ' ago';
    },
    saveOrder: function (order) {
      this.orders.push({
        userName: this.user,
        time: Date.now(),
        description: order.description,
        address: order.address,
        coords: order.coords
      });
      this.addPlacemark(order)
      this.goToPlace(order.coords)
    }
  }
}
</script>

<style scoped>
.container {
  color: #2699FB;
}
.panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 28vw;
  height: 100vh;
  background-color: #F1F9FF;
  z-index: 1;
}
.inner {
  width: calc(100% - 30px);
  height: calc(100% - 30px);
  margin: 15px;
}
#mask {
  background-color:rgba(0, 0, 0, 0.3);
  height:100%;
  position:fixed;
  width:100%;
  top:0;
  left:0;
  z-index: 2;
}
#map {
  float: right;
  width: 72vw;
  height: 100vh;
  margin: 0;
  top: 0;
  right: 0;
  background-color: #F1F9FF;
  z-index: 1;
}
.header {
  max-height: 44px;
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
.icon {
  float: right;
  width: 43px;
  height: 43px;
  display: -webkit-box;
}
.user {
  width: 30px;
  height: 30px;
  margin: 0;
  position: absolute;
  display: -webkit-box;
}
img {
  height: 100%;
  width: 100%;
  cursor: pointer;
}
.orders {
  margin-top: 15px;
  width: 100%;
  height: calc(100% - 60px);
  display: -webkit-inline-box;
  overflow: auto;
}
.order {
  width: 80%;
  height: 130px;
  padding: 30px 10%;
  background-color: #fff;
  cursor: pointer;
  margin-bottom: 15px;
  display: inline-block;
}
.head {
  width: 100%;
  height: 30px;
  position: relative;
  display: flex;
}
.user-name {
  width: calc(100% - 112px);
  text-align: left;
  margin-top: 7px;
  margin-left: 50px;
  font-size: 16px;
  font-weight: bold;
}
.time, .location>p {
  min-width: 69px;
  font-size: 10px;
  color: #bbb;
  text-align: right;
  right: 0;
}
.location {
  display: -webkit-box;
}
.location>p {
  width: 80%;
  text-align: left;
  margin: 2px 10px;
}
.description {
  font-size: 14px;
  text-align: left;
}
</style>
