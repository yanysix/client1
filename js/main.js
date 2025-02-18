Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
<div class="product">
    <div class="product-image">
    <img :src="image" :alt="altText"/>
    </div>
<div class="product-info">
    <h1>{{ title }}</h1>
    <p v-if="inStock">In stock</p>
    <p v-else :class="{ 'line-through': !inStock }">Out of Stock</p>
<ul>
    <p style="font-size: 20px">Состав</p>
    <product-details></product-details>
</ul>

<p>User is premium: {{ premium }}</p>
<p>Shipping: {{ shipping }}</p>
<div v-for="(variant, index) in variants" :key="variant.variantId"
class="variant" :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
    </div>
<ul>
    <li v-for="size in sizes" >{{ size }}</li>
</ul>

            <button v-on:click="addToCart" :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">Add to cart</button>
            <button v-on:click="decreaseCart" :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">Delete</button>
                  
  </div>
        <div>
          <h2>Reviews</h2>
          <p v-if="!reviews.length">There are no reviews yet.</p>
          <ul>
            <li v-for="review in reviews">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>{{ review.review }}</p>
            </li>
          </ul>
        </div>
        <product-review @review-submitted="addReview"></product-review>
    </div>
`,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            onSale: 'sale',
            selectedVariant: 0,
            altText: "A pair of socks",
            inStock: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
            updateProduct(index) {
                this.selectedVariant = index;
                console.log(index);


            },
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart',
                this.variants[this.selectedVariant].variantId);
        },
        decreaseCart() {
            this.$emit('delete-to-cart',
                this.variants[this.selectedVariant].variantId);
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product + ' ' + this.onSale;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }

    }

})

Vue.component('product-details', {
    template: `
        <ul>
            <li v-for="detail in details" >{{ detail }}</li>
        </ul>
   `,
    data() {
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral']
        }
    }
})
Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>
      <p>
         <label for="rating">Rating:</label>
         <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
         </select>
      </p>
      <label for="recommend" >Would you recommend this product?</label><br>
             <input type="radio" id="yes" name="recommend" value="yes">
             <label for="yes" >Yes</label><br>
             <input type="radio" id="no" name="recommend" value="no">
             <label for="no" >No</label><br>
      <p>
        <input type="submit" value="Submit">
      </p>
</form>
`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            recommended: null,
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating && this.recommend !== null) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if (this.recommend === null) this.errors.push("Recommendation required.")
            }
        }
    }
})
let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteCart() {
            if (this.cart.length <= 0) {
                return this.cart.length;
            } else
                this.cart.splice(this.cart.length -1,1);
        }
    }
})
    `
})

`