<script setup lang="ts">
import 'uno.css'

const classList = ref<string[]>([])
const isShowTips = ref(false)
const filterText = ref('')
const fontFamilyName = ref<string | undefined>('')

const filterClassList = computed(() => {
  return classList.value.filter((item) => {
    return item.includes(filterText.value)
  })
})

onMounted(() => {
  const pre = document.body.querySelector('pre')
  if (pre) {
    const cssText = pre.textContent
    if (cssText) {
      fontFamilyName.value = cssText.match(/font-family: "(?<name>.+?)";/)?.groups?.name

      classList.value = [
        ...cssText.matchAll(
          /.(?<name>.+?):(before|after)/g,
        ),
      ]
        .map((item) => {
          return item.groups?.name ?? ''
        })
        .filter(item => !!item)
    }
  }
})

const handleIconClick = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    isShowTips.value = true
    setTimeout(() => {
      isShowTips.value = false
    }, 1000)
  })
}
</script>

<template>
  <div class="w-full h-full fixed left-0 top-0 bg-white overflow-auto">
    <div class="py24px text-center">
      <input
        v-model="filterText"
        type="text"
        class="w-480px py14px px20px border rounded-md text-16px border border-solid border-bluegray-200 focus:border-bluegray-400 focus:outline-none"
        placeholder="Input the icon name"
      >
    </div>
    <div class="flex flex-wrap">
      <div
        v-for="item of filterClassList"
        :key="item"
        class="icon-box leading-[1] text-black text-32px flex flex-col items-center p4 hover:bg-bluegray-200 cursor-pointer rounded-md"
        :title="item"
        @click="handleIconClick(item)"
      >
        <i :class="[fontFamilyName, item]" style="font-size: inherit" />
        <div class="text-12px mt-2 w-6em truncate text-center">
          {{ item }}
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="isShowTips"
        class="inline-block rounded-md bg-green-500 text-white px-4 py-2 fixed top-24px left-50% -translate-x-1/2"
      >
        <span class="text-14px">Copied!</span>
      </div>
    </transition>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
