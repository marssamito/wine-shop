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
                  <a-checkable-tag
                    v-for="(tags, index) in getProductsTags"
                    :key="index"
                    v-model="checked1"
                    @change="onChange"
                  >
                    {{ tags }}
                  </a-checkable-tag>
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
              <div class="d-flex mt-3">
                <ul class="list-unstyled w-50 mb-0 pl-2">
                  <li>Hunters Late Harvest Sauvignon-Blanc 1 $200.00</li>
                  <li>Item 1 $230.00</li>
                  <li>Hunters Late Harvest Sauvignon-Blanc 1 $10.00</li>
                  <li>Item 1 $20.00</li>
                  <li>Item 1 $380.00</li>
                  <li>Item 1 $200.00</li>
                  <li>Item 1 $300.00</li>
                  <li>Item 1 $200.00</li>
                  <li>Item 1 $30.00</li>
                </ul>
                <div class="w-25 total">TOTAL <br />$800.00</div>
                <div class="w-25"></div>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <!-- products -->
        <a-row
          v-for="i in Math.ceil(Object.keys(getProducts).length / 3)"
          :key="i"
        >
          <a-col
            v-for="(product, index) in getProducts.slice((i - 1) * 3, i * 3)"
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
                    <b>Bottle</b> <br />${{ product.cost.bottle }}<br />
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
                    <b>Case</b> <br />${{ product.cost.case }}<br />
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
                  <a-button class="border-radius-0" @click="showDetailsModal"
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
  data() {
    return {
      checked1: '',
      search: '',
      // products: {},
      visible: false,
      loading: false,
    }
  },
  computed: {
    getProducts() {
      return this.$store.state.products.products
    },
    getProductsTags() {
      // merge all tags
      const tags = []
      for (let index = 0; index < this.getProducts.length; index++) {
        tags.push(this.getProducts[index].tags)
      }
      const mergedArray = tags.flat()
      // remove dublicates
      return [...new Map(mergedArray.map((tag) => [tag, tag])).values()]
    },
  },
  // Dispatch products from store just incase this.products is empty/updated
  async created() {
    if (Object.keys(this.getProducts).length === 0) {
      await this.$store.dispatch('products/fetchProducts')
    }
  },
  methods: {
    onChange(e) {
      // console.log(`checked = ${e.target.checked}`)
    },
    showDetailsModal() {
      this.visible = true
    },
    handleCancel(e) {
      this.visible = false
    },
  },
}
</script>
