<template>
  <div class="add-foodie container">
    <h2 class="center-align indigo-text">
      Add New Foodie Recipe
    </h2>
    <form @submit.prevent="addFoodie">
      <div class="field title">
        <label for="title">Foodie Title:</label>
        <input type="text" name="title" v-model="title" />
      </div>
      <div v-for="(ing, index) in ingredients" :key="index" class="field">
        <label for="ingredient">Ingredient:</label>
        <input type="text" name="ingredient" v-model="ingredients[index]" />
        <i class="material-icons delete" @click="deleteIng(ing)">delete</i>
      </div>
      <div class="field add-ingredient">
        <label for="add-ingredient"
          >Add an ingredient: (Press tab to add an ingredient)</label
        >
        <input
          type="text"
          name="add-ingredient"
          @keydown.tab.prevent="addIngr"
          v-model="ingredient"
        />
      </div>
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn pink">Add Foodie</button>
      </div>
    </form>
  </div>
</template>
<script>
import { firestore } from "@/firebase/init";
import slugify from "slugify";

export default {
  name: "AddFoodie",
  data() {
    return {
      title: null,
      ingredient: null,
      ingredients: [],
      feedback: null,
      slug: null
    };
  },
  methods: {
    addFoodie() {
      if (this.title) {
        this.feedback = null;
        //create a slug
        this.slug = slugify(this.title, {
          replacement: "-",
          remove: /[$*_+~.()'"|\-:@]/g,
          lower: true
        });
        firestore
          .collection("foodies")
          .add({
            title: this.title,
            ingredients: this.ingredients,
            slug: this.slug
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
        this.ingredients = [...this.ingredients, this.ingredient.trim()];
        this.ingredient = null;
        this.feedback = null;
      } else {
        this.feedback = "You must enter a value to add an ingredient";
      }
    },
    deleteIng(ing) {
      this.ingredients = this.ingredients.filter(ingredient => {
        return ingredient != ing;
      });
    }
  }
};
</script>
<style>
.add-foodie {
  margin-top: 3rem;
  padding: 1.2rem;
  max-width: 500px;
}
.add-foodie h2 {
  font-size: 2rem;
  margin: 1.2rem auto;
}
.add-foodie .field {
  margin: 1.2rem auto;
  position: relative;
}
.add-foodie .delete {
  position: absolute;
  right: 0;
  bottom: 16px;
  color: #aaa;
  font-size: 1.4rem;
  cursor: pointer;
}
</style>
