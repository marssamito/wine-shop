<template>
  <div id="cart">
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
      <template slot="operation" slot-scope="text, record, index">
        <a-popconfirm
          v-if="dataSource.length"
          title="Sure to delete?"
          @confirm="() => onDelete(index)"
        >
          <a href="javascript:;">x</a>
        </a-popconfirm>
      </template>
    </a-table>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      :title="'Kshs ' + totalInCart"
    />
  </div>
</template>
<script>
export default {
  name: 'Cart',
  props: {
    cart: {
      type: [Array],
      required: true,
    },
  },
  data() {
    return {
      dataSource: this.cart,
      columns: [
        {
          title: '',
          dataIndex: 'items.image',
          width: '1%',
          scopedSlots: { customRender: 'image' },
        },
        {
          title: 'Product',
          dataIndex: 'items',
          scopedSlots: { customRender: 'product' },
        },
        {
          title: 'Cost',
          dataIndex: 'total',
          width: '20%',
          scopedSlots: { customRender: 'total' },
        },
        {
          title: '',
          dataIndex: 'operation',
          width: '1%',
          scopedSlots: { customRender: 'operation' },
        },
      ],
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
    onDelete(key) {
      const dataSource = [...this.dataSource]
      this.dataSource = dataSource.filter((item, index) => index !== key)
    },
  },
}
</script>
