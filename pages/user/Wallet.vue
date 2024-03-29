<script setup lang="ts">
import { getNode } from '@formkit/core'
import DefaultDialog from '~/components/DefaultDialog.vue'
import WalletDialog from '~/components/WalletDialog.vue'

const { $dialog, $toast } = useNuxtApp()
const route = useRoute()
const walletTypeOption = ref(WalletType)
const expenseTypeOption = ref(expenseCategory)
const incomeTypeOption = ref(incomeCategory)
const monthStart = dayjsTz().startOf('month').startOf('day').toDate()
const monthEnd = dayjsTz().endOf('month').startOf('day').toDate()
const query = ref<IWalletQuery>({
  type: (route.query.type as string) || 'Expense',
  category: [],
  date: [monthStart, monthEnd],
})
const initialValue = {
  type: (route.query.type as string) || 'Expense',
  category: [],
  date: [monthStart, monthEnd],
}
const walletList = ref<getWalletRes[]>([])
const loading = ref<boolean>(false)
const drag = ref<boolean>(false)
const sideDownCategory = ref<string[]>([])
const dateRangeSelector = ref<any>(
  null,
)
// const baseDateRangePicker = createInput(BaseDateRangePicker, {
//   props: ['isRange'],
// })

const categoryOption = computed(() => {
  return query.value.type === 'Expense'
    ? expenseTypeOption.value
    : incomeTypeOption.value
})

const totalAmount = computed(() => {
  let total = 0
  walletList.value.forEach((item) => {
    total += item.total
  })

  return total.toLocaleString()
})

watch(
  () => query.value.type,
  (newValue) => {
    query.value.category
      = newValue === 'Expense' ? expenseTypeOption.value : incomeTypeOption.value
  },
  { immediate: true },
)

nextTick(async () => {
  castTypeOnCategory()
  await fetchWallet(getNode('walletForm')!.value as IWalletQuery)
})

function castTypeOnCategory() {
  const typeNode = getNode('type')
  const categoryNode = getNode('category')
  const options = typeNode?._value === 'Expense' ? expenseCategoryOptions : incomeCategoryOptions

  categoryNode!.context!.options = options

  typeNode!.on('commit', ({ payload }) => {
    const options = payload === 'Expense' ? expenseCategoryOptions : incomeCategoryOptions

    categoryNode!.context!.options = options
  })
}

async function fetchWallet(data: IWalletQuery) {
  try {
    const query = getNode('walletForm')!.value as IWalletQuery
    // to keep the category order the same all the time
    const formatQuery = {
      ...data,
      category: toRaw(query.category).sort(),
    }
    const result = await getWallet(formatQuery)
    walletList.value = result
    loading.value = true
  }
  catch (err) {
    console.error(err)
  }
  finally {
    loading.value = false
  }
}

function itemDateFormat(date: string) {
  return dayjsTz(date).format(DateEnum.dateFormat)
}

async function dragEnd() {
  drag.value = false
  const newDragList: Pick<IWalletItem, '_id' | 'category'>[] = walletList.value
    .map((categoryItem) => {
      return categoryItem.list.map((item) => {
        return {
          _id: item._id,
          category: categoryItem._id,
        }
      })
    })
    .flat()

  const result = await editSingleWalletCategory(newDragList)
  if (result.success) {
    const query = getNode('walletForm')!.value as IWalletQuery
    await fetchWallet(query)
    $toast.success('Edit category successfully!')
  }
}

function toggleSlide(_id: string) {
  if (sideDownCategory.value.includes(_id)) {
    const startIndex = sideDownCategory.value.indexOf(_id)
    sideDownCategory.value.splice(startIndex, 1)
  }
  else {
    sideDownCategory.value.push(_id)
  }
}

function amountHTML(item: IWalletItem) {
  return item.type === 'Expense'
    ? `<span class="mx-2 text-red-400">-${item.amount?.toLocaleString()}</span>`
    : `<span class="mx-2 text-blue-400">+${item.amount?.toLocaleString()}</span>`
}

// Add Dialog
function openAddDialog() {
  $dialog.open(WalletDialog, { title: 'Add' }).onOk(async (data) => {
    const result = await addSingleWallet(data)
    if (result.success) {
      const query = getNode('walletForm')!.value as IWalletQuery
      await fetchWallet(query)
      $toast.success('Add successfully!')
    }
  })
}

// Edit Dialog
function openEditDialog(walletItem: IWalletItem) {
  $dialog
    .open(WalletDialog, {
      title: 'Edit',
      walletItem: { ...walletItem },
    })
    .onOk(async (data) => {
      const result = await editSingleWallet(data)
      if (result.success) {
        const query = getNode('walletForm')!.value as IWalletQuery
        await fetchWallet(query)
        $toast.success('Edit successfully!')
      }
    })
}

// Delete Dialog
function openDeleteDialog(data: IWalletItem) {
  $dialog
    .open(DefaultDialog, {
      title: 'Confirmation',
      okText: 'Delete',
      content: `Are you sure to delete item-${data.item}?`,
      data,
    })
    .onOk(async (data) => {
      const result = await deleteSingleWallet(data._id)
      if (result.success) {
        const query = getNode('walletForm')!.value as IWalletQuery
        await fetchWallet(query)
        $toast.success('Delete successfully!')
      }
    })
}
</script>

<template>
  <div class="flex flex-row gap-4 border-b border-gray-500">
    <div class="basis-3/4">
      <div class="text-lg">
        <FormKit
          id="walletForm"
          v-model="query"
          :value="initialValue"
          type="form"
          submit-label="Search"
          @submit="fetchWallet"
        >
          <FormKit
            id="type"
            type="select"
            name="type"
            label="Type :"
            :options="walletTypeOption"
            inner-class="inline w-56"
            validation="required"
          />
          <FormKit
            id="category"
            v-model="query.category"
            :options="categoryOption"
            type="checkbox"
            label="Category :"
            name="category"
            validation="required"
            :sections-schema="{
              legend: { $el: 'div' },
            }"
          />
          <FormKit
            type="baseDateRangePicker"
            label="Date :"
            name="date"
            validation="required"
            wrapper-class="$remove:items-center items-start"
            outer-class="$reset mb-4"
            inner-class="$remove:formkit-inner"
            :is-range="true"
            btn-selected="This month"
          />
        </FormKit>
      </div>
    </div>
    <div class="basis-1/4">
      <button class="block w-52 btn-primary my-3 text-left" @click="openAddDialog">
        <Icon name="material-symbols:add-circle-outline" class="inline-block align-middle rounded text-3xl mr-2" />
        Add wallet
      </button>
      <button class="block w-52 btn-primary my-3 text-left">
        <Icon name="material-symbols:delete" class="inline-block align-middle rounded text-3xl mr-2" />
        Multiple delete
      </button>
    </div>
  </div>
  <br>
  <div v-if="loading" class="h-1/3 relative">
    <Loading :show="loading" />
  </div>
  <div v-else-if="walletList.length">
    <div class="dark:text-gray-100 text-lg font-bold">
      TOTAL: NT${{ totalAmount }}
    </div>
    <ul>
      <li v-for="{ list, _id, total } in walletList" :key="_id" class="bg-primary-100 dark:bg-primary-200 rounded-lg p-3 mb-3">
        <div class="text-xl font-bold mb-2">
          <Icon
            class="inline-block align-middle rounded text-2xl mr-2 bg-gray-300" :name="sideDownCategory.includes(_id)
              ? 'ic:sharp-minus'
              : 'ic:sharp-plus'
            " :class="[
              list.length ? 'cursor-pointer' : '',
            ]" @click="toggleSlide(_id)"
          />
          <span>{{ _id }} ${{ total.toLocaleString() }}</span>
        </div>
        <draggable
          :list="list" item-key="_id" :sort="false" ghost-class="ghost" chosen-class="drag-chosen"
          animation="300" tag="ul" group="wallet" handle=".moveIcon" @start="drag = true" @end="dragEnd"
        >
          <template #item="{ element }">
            <li
              v-show="sideDownCategory.includes(_id)"
              class="flex justify-between text-gray-200 bg-primary-200 dark:bg-primary-500 p-2 border-b border-secondary-100"
            >
              <div>
                <Icon
                  name="material-symbols:drag-indicator"
                  class="moveIcon align-text-top cursor-move text-white rounded-full p-1 text-xl"
                />
                {{ itemDateFormat(element.date) }} {{ element.item }}
              </div>
              <div>
                <div class="inline-block" v-html="amountHTML(element)" />
                <Icon
                  name="material-symbols:edit"
                  class="align-text-top cursor-pointer text-white bg-secondary-100 rounded-full p-1 text-xl mr-1.5"
                  @click="openEditDialog(element)"
                />
                <Icon
                  name="material-symbols:delete"
                  class="align-text-top cursor-pointer text-white bg-secondary-100 rounded-full p-1 text-xl"
                  @click="openDeleteDialog(element)"
                />
              </div>
            </li>
          </template>
        </draggable>
      </li>
    </ul>
  </div>
</template>
