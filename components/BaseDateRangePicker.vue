<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

type IBtnText = 'This month' | 'This week' | 'Today'

const props = withDefaults(defineProps<{
  modelValue: Date[],
  showBtn?: boolean,
  btnToShow?: IBtnText[]
}>(), {
  showBtn: true,
  btnToShow: () => ['This month', 'This week', 'Today']
})
const emits = defineEmits(['update:modelValue'])
defineExpose({
  selectDateRange
})
const dateRangeTextBtn = ref<string>('')

const date = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emits('update:modelValue', newValue)
  }
})

function selectDateRange(rangeTag: string) {
  dateRangeTextBtn.value = rangeTag
  let startDate = dayjsTz().startOf('month').startOf('day').toDate(),
    endDate = dayjsTz().endOf('month').startOf('day').toDate()
  switch (rangeTag) {
    case 'This month':
      startDate = dayjsTz().startOf('month').startOf('day').toDate();
      endDate = dayjsTz().endOf('month').startOf('day').toDate();
      break;
    case 'This week':
      startDate = dayjsTz().isoWeekday(1).startOf('day').toDate();
      endDate = dayjsTz().isoWeekday(7).startOf('day').toDate();
      break;
    case 'Today':
      startDate = dayjsTz().startOf('day').toDate();
      endDate = dayjsTz().startOf('day').toDate();
      break;
    default:
      break;
  }
  date.value = [startDate, endDate];
  emits('update:modelValue', [startDate, endDate])
}
</script>

<template>
  <vue-date-picker ref="datePicker" auto-apply format="yyyy-MM-dd" v-model="date" :enable-time-picker="false" range
    @update:model-value="dateRangeTextBtn = ''" />
  <div class="mt-4" v-if="showBtn">
    <button v-for="dateRange in btnToShow" :key="dateRange" @click="selectDateRange(dateRange)" :class="['btn', 'border', 'text-sm mr-2',
      dateRangeTextBtn === dateRange
        ? 'border-gray-100 text-gray-100'
        : 'border-gray-400 text-gray-400']">
      {{ dateRange }}
    </button>
  </div>
</template>