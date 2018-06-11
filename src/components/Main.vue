<template>
  <div class="container">
    <div class="panel">
      <div class="inner">
        <div class="header">
          <button class="order-button" @click="newOrderIsOpened = !newOrderIsOpened">Make new order</button>
          <div class="icon">
            <img src="../assets/profile.png" alt="icon" @click="openProfile(user)">
          </div>
        </div>
        <div class="orders">
          <div v-for="order in orders" class="order">
            <div class="head">
              <div class="user" @click="openProfile(order.user_id)">
                <img src="../assets/profile.png" alt="icon">
              </div>
              <span class="user-name">{{ order.username }}</span>
              <p class="time">{{ setTime(order.created_at) }}</p>
            </div>
            <p class="description">{{ order.description }}</p>
            <div class="location" @click="goToPlace([order.latitude, order.longitude])">
              <div style="width: 10px">
                <img src="../assets/location.png" alt="location: ">
              </div>
              <p>{{ order.address }}</p>
            </div>
            <!--{{ order }}-->
            <button v-if="!allOrders" class="order-button btn" @click="finishOrder(order.short_link)">
              Finish the order
            </button>
          </div>
        </div>
        <button class="order-button" @click="showOtherOption">
          {{ (allOrders) ? 'Orders which I took' : 'All orders' }}
        </button>
      </div>
    </div>
    <div class="mask"
         v-if="newOrderIsOpened"
         @click="newOrderIsOpened = false"
         ></div>
    <div class="mask" v-if="unrated"></div>
    <div id="map">
      <NewOrder
        v-if="newOrderIsOpened"
        :map="myMap"
        @cancel="newOrderIsOpened = false"
        @madeOrder="addPlacemark"
      />
      <Profile
        v-if="profileIsOpened"
        :user_id="openedProfile"
        @close="profileIsOpened = false"
      />
      <RateWindow
        v-if="unrated"
        :client="client"
        :details="res.description"
        @marked="rate"
      />
    </div>
  </div>
</template>

<script>
import NewOrder from './NewOrder'
import Profile from './Profile'
import RateWindow from './RateWindow'
import { createOrder,
  getOrders,
  getOrdersForUser,
  closeOrder,
  takeOrder,
  getUnratedOrder,
  rateUser,
  deleteOrder
} from "../helpers";

export default {
  name: 'MainPage',
 // props: ['user'],
  components: {
    NewOrder,
    Profile,
    RateWindow
  },
  data () {
    return {
      user: localStorage.getItem('user_id'),
      client: 'someone',
      allOrders: true,
      mustDelete: '',
      res: '',
      openedProfile: null,
      orders: [],
      myMap: null,
      myClusterer: null,
      myCollection: null,
      newOrderIsOpened: false,
      profileIsOpened: false,
      unrated: false
    }
  },
  mounted: function () {
    this.res = this.getDetails();
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
        self.myCollection = new ymaps.GeoObjectCollection();
      }
    },
    balloon: function (order, confirmed) {
      let self = this;
      let BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
        '<h3>' + (confirmed ? order.username : 'Me') + '</h3>' +
        '<p>'+ order.description +'</p>' +
        '<button id="submit-balloon">' + (confirmed ? 'Get the order' : 'Confirm an order') + '</button>' +
        '<button id="cancel">' + 'Cancel' + '</button>', {
          build: function () {
            BalloonContentLayout.superclass.build.call(this);
            $('#submit-balloon').bind('click', this.onSubmitClick);
            $('#cancel').bind('click', this.onCancelClick);
          },
          clear: function () {
            $('#submit-balloon').unbind('click', this.onSubmitClick);
            $('#cancel').unbind('click', this.onCancelClick);
            BalloonContentLayout.superclass.clear.call(this);
          },
          onSubmitClick: function () {
            return confirmed ? self.addToMyProgress(order.short_link, order.user_id) :
              self.saveOrder(order);
          },
          onCancelClick: function () {
            return self.myMap.balloon.close();
          }
        });
      return BalloonContentLayout;
    },
    addPlacemark: function(order, confirmed) {
      let self = this;
      ymaps.ready(add);

      function add() {
        let balloon = self.balloon(order, confirmed);
        let pm = new ymaps.Placemark([order.latitude, order.longitude], { }, {
          draggable: !confirmed,
          balloonContentLayout: balloon
        });
        if (confirmed) {
          self.myClusterer.add(pm);
          self.myMap.geoObjects.add(self.myClusterer);
        } else {
          self.myCollection.add(pm);
          self.myMap.geoObjects.add(self.myCollection);
        }
      }
    },
    addAll: async function () {
      let response;
      if (this.allOrders) {
        response = await getOrders();
      } else {
        response = await getOrdersForUser(this.user);
      }
      this.orders = response.data;
      for (let i = 0; i < this.orders.length; ++i) {
        await this.addPlacemark(this.orders[i], true)
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
        ((seconds >= 2) ? ' seconds' : ' second') + ' ago';
      if (hours < 1) return Math.floor(minutes) +
        ((minutes >= 2) ? ' minutes' : ' minute') + ' ago';
      return (days < 1) ? Math.floor(hours) +
        ((hours >= 2) ? ' hours' : ' hour') + ' ago' : Math.floor(days) +
        ((days >= 2) ? ' days' : ' day') + ' ago';
    },
    saveOrder: async function (order) {
      order['user_id'] = this.user;
      this.myMap.balloon.close();
      const response = await createOrder(order);
      this.myCollection.removeAll();
      this.addPlacemark(order, true);
    },
    addToMyProgress: async function (link, client) {
      this.myMap.balloon.close();
      await takeOrder({
        short_link: link,
        user_id: client,
        client_id: this.user
      });
    },
    openProfile: function (id) {
      this.openedProfile = id;
      this.profileIsOpened = true;
    },
    showOtherOption: function () {
      this.allOrders = !this.allOrders;
      this.orders = [];
      this.myClusterer.removeAll();
      this.addAll();
    },
    finishOrder: function (link) {
      closeOrder({
        user_id: this.user,
        short_link: link
      })
    },
    getDetails: async function () {
      this.res = await getUnratedOrder(this.user);
      if (this.res.data) {
        this.unrated = true;
        this.client = this.res.data.client_id;
        alert(this.client);
        this.mustDelete = this.res.data.short_link;
      }
    },
    rate: function (val) {
      let self = this;
      rateUser({
        user_id: this.client,
        value: val
      }).then(response => {
        deleteOrder(self.user, self.mustDelete).then(response => {
          self.unrated = false;
        })
      })
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
.mask {
  background-color:rgba(0, 0, 0, 0.7);
  height:100%;
  position: fixed;
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
.btn {
  padding: 7px 11px;
  margin: 8px 0;
  float: right;
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
  height: calc(100% - 108px);
  display: inline-block;
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
