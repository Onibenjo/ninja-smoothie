<template>
  <div class="index container" v-if="isLoaded">
    <div class="card" v-for="foodie in foodies" :key="foodie.id">
      <div class="card-content">
        <i class="material-icons delete" @click="deleteFoodie(foodie.id)"
          >delete</i
        >
        <h2 class="indigo-text">{{ foodie.title }}</h2>
        <ul class="ingredients">
          <li v-for="(ing, index) in foodie.ingredients" :key="index">
            <span class="chip">{{ ing }}</span>
          </li>
        </ul>
      </div>
      <span class="btn-floating btn-large halfway-fab pink">
        <router-link
          :to="{ name: 'EditFoodie', params: { foodie_slug: foodie.slug } }"
        >
          <i class="material-icons edit">edit</i>
        </router-link>
      </span>
    </div>
  </div>
  <div v-else>
    <loading-spinner />
  </div>
</template>

<script>
import { firestore } from "@/firebase/init";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  name: "Index",
  components: {
    LoadingSpinner
  },
  data() {
    return {
      isLoaded: false,
      foodies: []
    };
  },
  methods: {
    deleteFoodie(id) {
      this.isLoaded = false;
      firestore
        .collection("foodies")
        .doc(id)
        .delete()
        .then(() => {
          this.foodies = this.foodies.filter(foodie => foodie.id !== id);
          this.isLoaded = true;
        });
    }
  },
  created() {
    // fetch data from the firestore
    this.isLoaded = false;
    firestore
      .collection("foodies")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.foodies = [...this.foodies, { id: doc.id, ...doc.data() }];
        });
        this.isLoaded = true;
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
  margin-top: 4rem;
}

.index h2 {
  font-size: 1.8rem;
  text-align: center;
  margin-top: 0;
}
.index .ingredients {
  margin: 2rem auto;
}
.index .ingredients li {
  display: inline-block;
}
.index .delete {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  cursor: pointer;
  color: #aaa;
  font-size: 1.4em;
}
</style>
