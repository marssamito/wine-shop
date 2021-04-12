<template>
  <a-layout-content>
    <a-row>
      <a-col :span="18" :offset="3">
        <a-row class="mb-4">
          <!-- search/filters -->
          <a-col :span="6">
            <a-input-search
              v-model="search"
              placeholder="Search..."
              enter-button
              style="padding-right: 15px"
            />
            <a-tabs class="mt-2">
              <a-tab-pane key="1">
                <span slot="tab">
                  <a-icon type="filter" />
                  Show me
                </span>
                <div>
                  <template v-for="tags in getProductsTags">
                    <a-checkable-tag
                      :key="tags"
                      :checked="selectedTags.indexOf(tags) > -1"
                      @change="(checked) => onSelectTags(tags, checked)"
                    >
                      {{ tags }}
                    </a-checkable-tag>
                  </template>
                </div>
              </a-tab-pane>
              <a-button slot="tabBarExtraContent" type="link">
                Show all
              </a-button>
            </a-tabs>
          </a-col>
          <!-- cart/checkout -->
          <a-col :span="18">
            <a-card class="cart-summary-box">
              <div class="d-flex mt-3 align-items-center">
                <ul class="list-unstyled w-50 mb-0 pl-2">
                  <li>Hunters Late Harvest Sauvignon-Blanc 1 Kshs 200.00</li>
                  <li>Item 1 Kshs 230.00</li>
                  <li>Hunters Late Harvest Sauvignon-Blanc 1 Kshs 10.00</li>
                  <li>Item 1 Kshs 20.00</li>
                  <li>Item 1 Kshs 380.00</li>
                  <li>Item 1 Kshs 200.00</li>
                  <li>Item 1 Kshs 300.00</li>
                  <li>Item 1 Kshs 200.00</li>
                  <li>Item 1 Kshs 30.00</li>
                </ul>
                <div class="w-25 total">TOTAL <br />Kshs 800.00</div>
                <div class="w-25">
                  <a-button class="border-radius-0" @click="showModal"
                    >CART</a-button
                  >
                  <a-button
                    type="primary"
                    class="border-radius-0"
                    @click="showModal"
                  >
                    CHECKOUT
                  </a-button>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <!-- products -->
        <span v-if="products.length !== 0">
          <a-row v-for="i in Math.ceil(products.length / 3)" :key="i">
            <a-col
              v-for="(product, index) in products.slice((i - 1) * 3, i * 3)"
              :key="index"
              :span="8"
            >
              <a-card class="products-box">
                <!-- image -->
                <div class="image">
                  <img
                    :src="$config.imgBaseUrl + product.image"
                    alt=""
                    srcset=""
                  />
                </div>
                <!-- content -->
                <div class="content">
                  <h1 class="mb-0">{{ product.no }}</h1>
                  <h2>{{ product.name }}</h2>
                  <div class="d-flex mt-4">
                    <div class="bottle">
                      <b>Bottle</b> <br />Kshs {{ product.cost.bottle }}<br />
                      <a-input-number
                        size="small"
                        :min="0"
                        :max="100000"
                        :default-value="0"
                        class="mr-1"
                        @change="onChange"
                      />QTY
                    </div>
                    <div class="case">
                      <b>Case</b> <br />Kshs {{ product.cost.case }}<br />
                      <a-input-number
                        size="small"
                        :min="0"
                        :max="100000"
                        :default-value="0"
                        class="mr-1"
                        @change="onChange"
                      />QTY
                    </div>
                  </div>
                  <a-button-group class="mt-3">
                    <a-button class="border-radius-0" @click="showModal"
                      >Details</a-button
                    >
                    <a-button type="primary" class="border-radius-0">
                      Add to Cart
                    </a-button>
                  </a-button-group>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </span>
        <span v-else> <a-empty /> </span>
      </a-col>
    </a-row>

    <!-- MODAL - Details -->
    <a-modal
      title="Product Details"
      :visible="visible"
      :confirm-loading="loading"
      centered
      :closable="false"
      :mask-closable="false"
      on-ok="handleOk"
      footer=""
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>

      <div class="ant-modal-footer">
        <a-button
          key="back"
          :disabled="loading ? true : false"
          @click="handleCancel"
        >
          Close
        </a-button>
      </div>
    </a-modal>
  </a-layout-content>
</template>

<script>
export default {
  name: 'Shop',
  async asyncData(context) {
    if (context.store.state.products.products.length === 0) {
      await context.store.dispatch('products/fetchProducts')
    }
  },
  data() {
    return {
      checked1: '',
      search: '',
      products: this.$store.state.products.products,
      visible: false,
      loading: false,
      selectedProds: [],
      selectedTags: [],
    }
  },
  computed: {
    getProducts() {
      const productsData = this.products

      // search
      // if (this.search !== '') {
      //   const searchValue = this.search.toLowerCase().slice(1)

      //   return productsData.filter((product, index) => {
      //     return (
      //       product.name.toLowerCase().includes(searchValue) ||
      //       product.no.toLowerCase().includes(searchValue) ||
      //       product.details.toLowerCase().includes(searchValue)
      //     )
      //   })
      // }
      return productsData
    },
    getProductsTags() {
      // merge all tags
      const tags = []
      const products = this.$store.state.products.products
      for (let index = 0; index < products.length; index++) {
        tags.push(products[index].tags)
      }
      const mergedArray = tags.flat()
      // remove dublicates
      return [...new Map(mergedArray.map((tag) => [tag, tag])).values()]
    },
  },
  // watch for any changes in products
  watch: {
    getProducts() {
      this.products = this.getProducts
    },
    onSelectTags() {},
  },
  // Fetch products from store just incase this.products is empty/updated
  mounted() {},
  methods: {
    onSelectTags(tag, checked) {
      const { selectedTags } = this
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter((t) => t !== tag)

      this.selectedTags = nextSelectedTags

      const products = this.$store.state.products.products

      if (this.selectedTags.length !== 0) {
        this.products = products.filter((product, index) => {
          return this.selectedTags.some((item) => product.tags.includes(item))
        })
      } else {
        this.products = this.$store.state.products.products
      }
    },
    onChange(e) {
      // console.log(`checked = ${e.target.checked}`)
    },
    showModal() {
      this.visible = true
    },
    handleCancel(e) {
      this.visible = false
    },
  },
}
</script>
