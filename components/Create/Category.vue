<template>
  <section>
    <h1 class="subtitle is-size-3">Create new category</h1>
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
        <b-input v-model="category.imageURL" placeholder="Enter the image link" :disabled="loading" required></b-input>
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
        <b-input v-model="category.slug" placeholder="Your category will be located here" disabled required></b-input>
      </b-field>
      <b-field label="Name">
        <b-input v-model="category.name" @blur="generateSlug" placeholder="Enter the category name" :disabled="loading" required></b-input>
      </b-field>
      <b-field label="Message">
        <b-input maxlength="700" type="textarea" v-model="category.description"></b-input>
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
      category: {
        name: '',
        imageURL: '',
        description: '',
        slug: ''
      },
      id: '',
      mode: 'link',
      file: {},
      loading: false,
    };
  },
  mounted() {
    this.id = uuid.v4().slice(0, 8);
  },
  methods: {
    async submit() {
      this.loading = true;

      try {
        if (this.mode === 'file') {
          const cloudinaryLink = await this.uploadToCloudinary();
          this.category.imageURL = cloudinaryLink;
        }

        await this.$axios.post('/create/category', this.category, {
          headers: {
            authorization: this.user.token,
          },
          credentials: true
        });

        this.$buefy.snackbar.open({
          duration: 10000,
          message: 'Category uploaded and created successfully',
          type: 'is-success',
        });

        this.resetData();
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
      const slug = this.category.name.toLowerCase().replace(/\s/g, "-") + "-" + this.id;
      this.category.slug = slug
    },

    resetData() {
      this.mode === 'link' ? (this.category.imageURL = '') : (this.file = {});

      this.category =  {
        name: '',
        imageURL: '',
        description: '',
        slug: ''
      };

      this.id = uuid.v4().slice(0, 8);
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
