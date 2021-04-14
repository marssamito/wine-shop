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
              <a-button slot="tabBarExtraContent" type="link" @click="showAll">
                Show all
              </a-button>
            </a-tabs>
          </a-col>
          <!-- cart/checkout -->
          <a-col :span="18">
            <a-card class="cart-summary-box">
              <div class="d-flex align-items-center">
                <ul
                  v-if="cart.length !== 0"
                  class="list-unstyled w-50 mb-0 pl-2"
                >
                  <li
                    v-for="(val, index) in cart.slice().reverse()"
                    :key="index"
                  >
                    <div v-if="val.sub_total.bottle !== 0" class="d-flex">
                      <div class="w-75">
                        {{ index + 1 }}. {{ val.items.name }} (Bottle)
                        <strong
                          >{{ val.items.qtyBottle }} x
                          {{ Math.round(val.items.cost.bottle) }}</strong
                        >
                      </div>
                      <div class="text-right w-25 mr-2">
                        Kshs {{ val.sub_total.bottle }}
                      </div>
                    </div>
                    <div v-else-if="val.sub_total.case !== 0" class="d-flex">
                      <div class="w-75">
                        {{ index + 1 }}. {{ val.items.name }} (Case)
                        <strong
                          >{{ val.items.qtyCase }} x
                          {{ Math.round(val.items.cost.case) }}</strong
                        >
                      </div>
                      <div class="text-right w-25 mr-2">
                        Kshs {{ val.sub_total.case }}
                      </div>
                    </div>
                  </li>
                </ul>
                <ul v-else class="list-unstyled w-50 mb-0 pl-2 alert">
                  <li>
                    <a-alert message="Empty cart" banner type="info" />
                  </li>
                </ul>

                <div class="w-25 total">TOTAL <br />Kshs {{ total }}</div>
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
                        :max="100"
                        :default-value="0"
                        class="mr-1"
                        @change="
                          addQtyBootleToProducts($event, product.no, 'bottle')
                        "
                      />QTY
                    </div>
                    <div class="case">
                      <b>Case</b> <br />Kshs {{ product.cost.case }}<br />
                      <a-input-number
                        size="small"
                        :min="0"
                        :max="100"
                        :default-value="0"
                        class="mr-1"
                        @change="
                          addQtyBootleToProducts($event, product.no, 'case')
                        "
                      />QTY
                    </div>
                  </div>
                  <a-button-group class="mt-3">
                    <a-button
                      class="border-radius-0"
                      @click="detailsModal(product.no, 'details')"
                      >Details</a-button
                    >
                    <a-button
                      type="primary"
                      class="border-radius-0"
                      @click="addToCart(product.no)"
                    >
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
      title=""
      :visible="visible"
      :confirm-loading="loading"
      centered
      :closable="false"
      :mask-closable="false"
      on-ok="handleOk"
      footer=""
    >
      <Details v-if="modalType == 'details'" :details="details" />

      <div class="ant-modal-footer">
        <a-button
          key="back"
          :disabled="loading ? true : false"
          @click="handleCancel"
        >
          Close
        </a-button>
        <a-button
          v-if="modalType == 'qty'"
          key="back"
          type="primary"
          :disabled="loading ? true : false"
        >
          Submit
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
      selectedProds: [],
      selectedTags: [],
      details: [],
      cart: [],
      //
      visible: false,
      loading: false,
      modalType: '',
    }
  },
  computed: {
    getProducts() {
      const productsData = this.$store.state.products.products

      // search
      if (this.search !== '') {
        const searchValue = this.search.toLowerCase().slice(1)

        return productsData.filter((product, index) => {
          return (
            product.name.toLowerCase().includes(searchValue) ||
            product.no.toLowerCase().includes(searchValue) ||
            product.details.toLowerCase().includes(searchValue)
          )
        })
      }
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
    total() {
      return this.cart.reduce(function (total, value) {
        return total + Number(value.total)
      }, 0)
    },
  },
  // watch for any changes in getProducts
  watch: {
    getProducts() {
      this.products = this.getProducts
    },
    onSelectTags() {},
    cart() {},
    addQtyBootleToProducts() {},
    addToCart() {},
  },
  methods: {
    // ---- 1. FILTER TAGS/CATEGORIES
    onSelectTags(tag, checked) {
      // get selected tags to an arrray this.selectedTags
      const { selectedTags } = this
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter((t) => t !== tag)

      this.selectedTags = nextSelectedTags

      const products = this.$store.state.products.products

      // filter selected tags
      if (this.selectedTags.length !== 0) {
        this.products = products.filter((product, index) => {
          return this.selectedTags.some((item) => product.tags.includes(item))
        })
      } else {
        this.products = this.$store.state.products.products
      }
    },
    // ---- 2. SHOW MORE DETAILS MODAL
    detailsModal(idNo, modalType) {
      this.visible = true
      this.modalType = modalType

      const products = this.$store.state.products.products
      this.details = products.filter((product) => {
        return product.no.includes(idNo)
      })
    },
    // ---- 3. ADD TO CART
    addToCart(idNo) {
      const products = this.$store.state.products.products

      for (let index = 0; index < products.length; index++) {
        if (products[index].no === idNo) {
          // check QTY is selected
          if (products[index].qtyBottle || products[index].qtyCase) {
            //
            const bottleSubTotal =
              Math.round(
                products[index].qtyBottle * products[index].cost.bottle
              ) || 0
            const caseSubTotal =
              Math.round(products[index].qtyCase * products[index].cost.case) ||
              0
            this.cart.push({
              items: products[index],
              sub_total: {
                bottle: bottleSubTotal,
                case: caseSubTotal,
              },
              total: bottleSubTotal + caseSubTotal,
            })
            this.$message
              .loading('Adding ' + products[index].name + ' to cart...', 2.5)
              .then(() =>
                this.$message.success(
                  'Successfully added ' + products[index].name + ' to cart.',
                  2.5
                )
              )
          } else {
            this.$notification.error({
              message: 'Add to Cart',
              description:
                'Kindly select Quantity (QTY) for ' + products[index].name,
              duration: 8,
            })
          }
        }
      }
    },
    addQtyBootleToProducts(number, idNo, qtyType) {
      const products = this.products
      for (let index = 0; index < products.length; index++) {
        if (products[index].no === idNo) {
          if (qtyType === 'bottle') {
            products[index].qtyBottle = number
          } else if (qtyType === 'case') {
            products[index].qtyCase = number
          }
        }
      }
    },
    // addQtyCaseToProducts(idNo, qtyNumber) {},
    // ---- 5. RESET/ SHOW ALL PRODUCTS
    showAll() {
      this.products = this.$store.state.products.products
      this.selectedTags = []
      this.search = ''
    },
    onChange(e) {
      // console.log(`checked = ${e.target.checked}`)
    },
    showModal() {
      this.visible = true
    },
    handleCancel() {
      this.visible = false
      this.modalType = ''
    },
  },
}
</script>
