<template>
  <section>
    <h1 class="subtitle is-size-3">Create new product</h1>
    <form @submit.prevent="submit" class="form">
      <b-field label="Image Mode">
        <b-select
          placeholder="Select Create Mode"
          v-model="mode"
          expanded>
          <option value="link">Link to the Image</option>
          <option value="file">Upload the Image</option>
        </b-select>
      </b-field>
      <b-field label="Image Link" v-if="mode === 'link'">
        <b-input v-model="product.imageURL" placeholder="Enter the image link" :disabled="loading" required></b-input>
      </b-field>
      <b-field label="Image" v-if="mode === 'file'">
        <b-field class="file is-primary" :class="{'has-name': !!file}">
          <b-upload v-model="file" accept=".jpg, .png, .jpeg, .webp, .gif" class="file-label" validation-message="Only jpg, jpeg and png are allowed" :disabled="loading" required name="file">
            <span class="file-cta">
              <b-icon class="file-icon" icon="upload"></b-icon>
              <span class="file-label">Click to upload</span>
            </span>
            <span class="file-name" v-if="file">
              {{ file.name }}
            </span>
          </b-upload>
        </b-field>
      </b-field>
      <b-field label="URL">
        <b-input v-model="product.slug" placeholder="Your product will be located here" disabled required></b-input>
      </b-field>
      <b-field label="Name">
        <b-input v-model="product.name" @blur="generateSlug" placeholder="Enter the product name" :disabled="loading" required></b-input>
      </b-field>
      <b-field label="Categories">
        <b-select
          multiple
          native-size="2"
          placeholder="Select the product's categories"
          :loading="catLoading"
          required
          v-model="product.categories">
          <option v-if="catLoading" selected disabled>-- Not selected --</option>
          <option v-for="option in allCategories" :key="option.id" :value="option._id">
            {{option.name}}
          </option>
        </b-select>
      </b-field>
      <b-field label="Manufacturer">
        <!-- <b-input v-model="product.manufacturer" @blur="generateSlug" placeholder="Who made the product" :disabled="loading" required></b-input> -->
        <b-select placeholder="Select a name">
          <option value="Toyota">Toyota</option>
          <option value="Lexus">Lexus</option>
          <option value="Mercedes Benz">Mercedes Benz</option>
          <option value="Honda">Honda</option>
          <option value="Ford">Ford</option>
          <option value="Hyundai">Hyundai</option>
          <option value="Land Rover">Land Rover</option>
        </b-select>
      </b-field>
      <b-field label="Part Number">
        <b-input v-model="product.partNumber" @blur="generateSlug" placeholder="Provide the products unique Part ID" :disabled="loading" required></b-input>
      </b-field>
      <b-field label="Specification">
        <b-input v-model="product.specification" @blur="generateSlug" placeholder="Provide the products unique specification" :disabled="loading" required></b-input>
      </b-field>
      <b-field label="Rating">
        <b-rate
          v-model="product.rating"
          :disabled="loading"
          required
          icon-pack="mdi"
          icons="star"
          custom-text="Provide the average product rating"></b-rate>
      </b-field>
      <b-field label="Min Price">
        <b-numberinput v-model="product.price.min" placeholder="Provide the minimum possible product price" :disabled="loading" controls="false" required></b-numberinput>
      </b-field>
      <b-field label="Max Price">
        <b-numberinput v-model="product.price.max" placeholder="Provide the maximum possible product price" :disabled="loading" controls="false" required></b-numberinput>
      </b-field>
      <b-field label="Description">
        <b-input maxlength="700" type="textarea" v-model="product.description"></b-input>
      </b-field>
      <b-button native-type="submit" type="is-primary" :loading="loading">Submit</b-button>
    </form>
    <p>Want to confirm your uploads? <NuxtLink to="/view/categories">View Categories</NuxtLink></p>
  </section>
</template>

<script>
import { uuid } from 'vue-uuid'
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['user']),
  },
  data() {
    return {
      product: {
        name: '',
        imageURL: '',
        categories: [],
        manufacturer: '',
        partNumber: '',
        specification: '',
        rating: '',
        price: {
          min: 0,
          max: 0
        },
        description: '',
        slug: ''
      },
      id: '',
      mode: 'link',
      file: {},
      allCategories: [],
      catLoading: true,
      loading: false,
    };
  },
  async mounted() {
    this.id = uuid.v4().slice(0, 8);
    await this.fetchCategories();
  },
  methods: {
    async submit() {
      this.loading = true;

      try {
        if (this.mode === 'file') {
          const cloudinaryLink = await this.uploadToCloudinary();
          this.product.imageURL = cloudinaryLink;
        }

        await this.$axios.post('/create/product', this.product, {
          headers: {
            authorization: this.user.token,
          },
          credentials: true
        });

        this.$buefy.snackbar.open({
          duration: 10000,
          message: 'Product uploaded and created successfully',
          type: 'is-success',
        });

        await this.resetData();
      } catch (error) {
        this.$buefy.snackbar.open({
          duration: 5000,
          message: `Something went wrong - ${error.message}`,
          type: 'is-danger',
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      await this.$axios.get('view/categories/all/', {
        headers: {
          authorization: this.user.token,
        },
      }).then((res) => {
        this.allCategories = res.data
        this.catLoading = false
      }).catch((e) => {
        console.error(e)
        this.$buefy.snackbar.open({
          duration: 10000,
          message: 'Error while fetching categories'
        });
      })
    },

    async uploadToCloudinary() {
      try {
        if (this.file.size >= 512000) {
          throw new Error('File should be less than 500kb');
        }

        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('upload_preset', 'sitmp7vs');
        formData.append('folder', 'rexapp');

        const response = await fetch('https://api.cloudinary.com/v1_1/dsgvwxygr/image/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }

        return data.secure_url;
      } catch (error) {
        throw error;
      }
    },

    generateSlug() {
      const slug = this.product.name.toLowerCase().replace(/\s/g, "-") + "-" + this.product.manufacturer.toLowerCase().replace(/\s/g, "-") + "-" + this.product.partNumber.toLowerCase().replace(/\s/g, "-") + "-" + this.product.specification.toLowerCase().replace(/\s/g, "-") + "-" + this.id;
      this.product.slug = slug
    },

    async resetData() {
      this.mode === 'link' ? (this.product.imageURL = '') : (this.file = {});

      this.product = {
        name: '',
        imageURL: '',
        categories: [],
        manufacturer: '',
        partNumber: '',
        specification: '',
        rating: '',
        price: {
          min: 0,
          max: 0
        },
        description: '',
        slug: ''
      }

      this.id = uuid.v4().slice(0, 8);

      await this.fetchCategories();
    }

  },
};
</script>

<style lang="scss" scoped>
section {
  padding: 1rem;
  margin: 2rem auto;
  width: 400px;
  display: block;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);

  p {
    margin: 1rem 0;
    text-align: left;
  }

  @media screen and (max-width: $medium) {
    max-width: 90%;
  }
}
</style>
