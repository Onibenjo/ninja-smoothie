<template>
  <div class="edit-foodie container" v-if="foodie">
    <h2>Edit {{ foodie.title }}</h2>
    <form @submit.prevent="editFoodie">
      <div class="field title">
        <label for="title">Foodie Title:</label>
        <input type="text" name="title" v-model="foodie.title" />
      </div>
      <div
        v-for="(ing, index) in foodie.ingredients"
        :key="index"
        class="field"
      >
        <label for="ingredient">Ingredient:</label>
        <input
          type="text"
          name="ingredient"
          v-model="foodie.ingredients[index]"
        />
        <i class="material-icons delete" @click="deleteIng(ing)">delete</i>
      </div>
      <div class="field add-ingredient">
        <label for="add-ingredient">
          Add an ingredient: (Press tab to add an ingredient)
        </label>
        <input
          type="text"
          name="add-ingredient"
          @keydown.tab.prevent="addIngr"
          v-model="ingredient"
        />
      </div>
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn pink">Update Foodie</button>
      </div>
    </form>
  </div>
</template>
<script>
import { firestore } from "@/firebase/init";
import slugify from "slugify";

export default {
  name: "EditFoodie",
  data() {
    return {
      foodie: null,
      ingredient: null,
      feedback: null
    };
  },
  created() {
    let ref = firestore
      .collection("foodies")
      .where("slug", "==", this.$route.params.foodie_slug);
    ref.get().then(snapshot => {
      snapshot.forEach(doc => {
        this.foodie = doc.data();
        this.foodie.id = doc.id;
      });
    });
  },
  methods: {
    editFoodie() {
      if (this.foodie.title) {
        this.feedback = null;
        //create a slug
        this.foodie.slug = slugify(this.foodie.title, {
          replacement: "-",
          remove: /[$*_+~.()'"|\-:@]/g,
          lower: true
        });
        firestore
          .collection("foodies")
          .doc(this.foodie.id)
          .update({
            title: this.foodie.title,
            ingredients: this.foodie.ingredients,
            slug: this.foodie.slug
          })
          .then(() => {
            this.$router.push({ name: "Home" });
          })
          .catch(e => console.log(e));
      } else {
        this.feedback = "You must enter a foodie title";
      }
    },
    addIngr() {
      if (this.ingredient && this.ingredient.trim().length) {
        this.foodie.ingredients.push(this.ingredient.trim());
        this.ingredient = null;
        this.feedback = null;
      } else {
        this.feedback = "You must enter a value to add an ingredient";
      }
    },
    deleteIng(ing) {
      this.foodie.ingredients = this.foodie.ingredients.filter(ingredient => {
        return ingredient != ing;
      });
    }
  }
};
</script>
<style>
.edit-foodie {
  margin-top: 3rem;
  padding: 1.2rem;
  max-width: 500px;
}
.edit-foodie h2 {
  font-size: 2rem;
  margin: 1.2rem auto;
}
.edit-foodie .field {
  margin: 1.2rem auto;
  position: relative;
}
.edit-foodie .delete {
  position: absolute;
  right: 0;
  bottom: 16px;
  color: #aaa;
  font-size: 1.4rem;
  cursor: pointer;
}
</style>
