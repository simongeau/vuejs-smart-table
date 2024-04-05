import { defineComponent, watch, toRef, PropType, h, provide, InjectionKey, isVue2, computed } from 'vue-demi'
import { Filters, SelectionMode, TableState } from './types'
import { Store } from './Store'

export const storeKey: InjectionKey<Store> = Symbol('store-key')

export default defineComponent({
  name: 'VTable',
  props: {
    data: {
      type: Array,
      required: true
    },
    filters: {
      type: Object as PropType<Filters>,
      required: false,
      default: () => ({})
    },
    currentPage: {
      type: Number,
      required: false,
      default: undefined
    },
    pageSize: {
      type: Number,
      required: false,
      default: undefined
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      required: false,
      default: 'single',
      validator: (val: string) => ['single', 'multiple'].includes(val)
    },
    selectedClass: {
      required: false,
      type: String,
      default: 'vt-selected'
    },
    selectOnClick: {
      required: false,
      type: Boolean,
      default: true
    },
    hideSortIcons: {
      required: false,
      type: Boolean,
      default: false
    },
    sortIconPosition: {
      required: false,
      type: String,
      default: 'after'
    },
    sortHeaderClass: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: {
    stateChanged: (state: TableState) => true,
    totalPagesChanged: (pages: number) => true,
    totalItemsChanged: (pages: number) => true
  },
  setup (props, ctx) {
    // @ts-ignore
    const store = new Store(ctx.emit)
    provide(storeKey, store)

    store.syncProp('data', toRef(props, 'data'))
    store.syncProp('filters', toRef(props, 'filters'), true)
    store.syncProp('currentPage', toRef(props, 'currentPage'))
    store.syncProp('pageSize', toRef(props, 'pageSize'))
    store.syncProp('selectionMode', toRef(props, 'selectionMode'))
    store.syncProp('selectedClass', toRef(props, 'selectedClass'))
    store.syncProp('selectOnClick', toRef(props, 'selectOnClick'))
    store.syncProp('hideSortIcons', toRef(props, 'hideSortIcons'))
    store.syncProp('sortIconPosition', toRef(props, 'sortIconPosition'))
    store.syncProp('sortHeaderClass', toRef(props, 'sortHeaderClass'))

    const allRowsSelected = computed(() => store.state.selectedRows.length === store.state.data.length)
    const toggleAllRows = () => allRowsSelected.value ? store.deselectAll() : store.selectAll()

    return {
      store: store,
      tableState: store.tableState,
      allRowsSelected,
      toggleAllRows,
      selectAll: () => store.selectAll(),
      deselectAll: () => store.deselectAll(),
      selectRows: (rows: any[]) => store.selectRows(rows),
      selectRow: (row: any) => store.selectRow(row),
      deselectRows: (rows: any[]) => store.deselectRows(rows),
      deselectRow: (row: any) => store.deselectRow(row),
      revealItem: (item: any | ((item: any) => boolean)) => store.revealItem(item),
      slots: ctx.slots
    }
  },
  render () {
    return h('table', {
      class: 'v-table'
    }, [
      h('thead', this.slots.head ? this.slots.head({
        rows: this.tableState.rows,
        selectedRows: this.tableState.selectedRows,
        toggleAllRows: this.toggleAllRows,
        selectAll: this.selectAll,
        deselectAll: this.deselectAll,
        allRowsSelected: this.allRowsSelected
      }) : undefined),
      h('tbody', this.slots.body? this.slots.body({
        rows: this.tableState.rows,
        selectedRows: this.tableState.selectedRows,
        selectRow: this.selectRow,
        deselectRow: this.deselectRow,
      }) : undefined),
      h('tfoot', this.slots.foot ? this.slots.foot({
        rows: this.tableState.rows,
        selectedRows: this.tableState.selectedRows,
        toggleAllRows: this.toggleAllRows,
        selectAll: this.selectAll,
        deselectAll: this.deselectAll,
        allRowsSelected: this.allRowsSelected,
      }) : undefined),
    ])
  }
})
