<template>
  <div id="cart">
    <a-form-model
      layout="inline"
      ref="formData"
      :model="formData"
      :rules="rules"
    >
      <!-- Your Billing Details -->
      <h4><strong>Your Billing Details</strong></h4>
      <a-form-model-item has-feedback>
        <a-input v-model="formData.full_names" placeholder="Full names">
          <a-icon slot="prefix" type="user" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item has-feedback>
        <a-input v-model="formData.estate" type="text" placeholder="Estate">
          <a-icon slot="prefix" type="flag" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item has-feedback>
        <a-input v-model="formData.phone_no" type="number" min="1">
          <a-icon
            slot="prefix"
            type="number"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-model-item>
      <a-form-model-item has-feedback>
        <a-input v-model="formData.address" type="textarea" autocomplete="off">
          <a-icon
            slot="prefix"
            type="file"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-model-item>
      <!-- Your Order -->
      <h4 class="mt-2"><strong>Your Order</strong></h4>
      <a-table
        bordered
        :data-source="dataSource"
        :columns="columns"
        :pagination="false"
      >
        <template slot="product" slot-scope="product, record, index">
          <strong>{{ product.name }}</strong>
          <div v-if="record.sub_total.bottle !== 0" class="d-flex">
            <div class="w-75">
              {{ index + 1 }}. {{ record.items.name }} (Bottle)
              <strong
                >{{ record.items.qtyBottle }} x
                {{ Math.round(record.items.cost.bottle) }}</strong
              >
            </div>
          </div>
          <div v-else-if="record.sub_total.case !== 0" class="d-flex">
            <div class="w-75">
              {{ index + 1 }}. {{ record.items.name }} (Case)
              <strong
                >{{ record.items.qtyCase }} x
                {{ Math.round(record.items.cost.case) }}</strong
              >
            </div>
          </div>
        </template>
        <template slot="image" slot-scope="image">
          <img :src="$config.imgBaseUrl + image" alt="" />
        </template>
      </a-table>
      <div class="placeholder">
        <h3>Kshs {{ totalInCart }}</h3>
        <hr />
        <h4 class="mb-1"><strong>Select your payment method</strong></h4>
        <a-checkbox v-model="formData.paymentMethod">
          Direct bank transfer
        </a-checkbox>
      </div>
    </a-form-model>
  </div>
</template>
<script>
export default {
  props: {
    cart: {
      type: [Array],
      required: true,
    },
  },
  data() {
    return {
      formData: {
        full_names: '',
        estate: '',
        phone_no: '',
        address: '',
      },
      paymentMethod: true,
      dataSource: this.cart,
      columns: [
        {
          title: 'Total',
          dataIndex: 'total',
          width: '30%',
          scopedSlots: { customRender: 'total' },
        },
        {
          title: 'Product',
          dataIndex: 'items',
          scopedSlots: { customRender: 'product' },
        },
      ],
      rules: {
        full_names: {
          required: true,
          message: 'Please input your full names.',
        },
        estate: {
          required: true,
          message: 'Please input your Estate.',
        },
        phone_no: {
          required: true,
          message: 'Please input your phone number.',
        },
        address: {
          required: true,
          message: 'Please input your full address.',
        },
      },
    }
  },
  computed: {
    totalInCart() {
      return this.dataSource.reduce(function (total, value) {
        return total + Number(value.total)
      }, 0)
    },
  },
  methods: {
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find((item, index) => index === key)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },
  },
}
</script>
