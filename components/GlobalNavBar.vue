<script lang="ts" setup>
const user = useUserStore()
const app = useNuxtApp()
const { $colorMode } = app
const { isLoggedIn, userInfo } = storeToRefs(user)
const route = useRoute()

function setColorMode() {
  $colorMode.preference = $colorMode.preference === 'light'
    ? 'dark'
    : 'light'
}
</script>

<template>
  <nav class="bg-primary-100 h-[4rem] text-gray-500 font-bold px-3 flex justify-between items-center text-xl">
    <NuxtLink to="/" class=" font-bold text-primary-500">
      <Icon name="solar:chat-round-money-bold" class="text-4xl rounded bg-primary-100 md:text-xl" />
      <span class="align-middle">
        MoneyTracker
      </span>
    </NuxtLink>
    <div>
      <NuxtLink v-slot="{ isActive }" to="/productPlan" title="Product Plan">
        <span class="mx-3 hover:underline" :class="[isActive ? 'text-black' : 'hover:text-gray-500']">Product Plan</span>
      </NuxtLink>
      <NuxtLink v-if="!isLoggedIn" v-slot="{ isActive }" class="mx-3" to="/auth/logIn" title="Log In">
        <span class="hover:underline" :class="[isActive ? 'text-black' : 'hover:text-gray-500']">Log in</span>
      </NuxtLink>
      <NuxtLink v-if="!isLoggedIn" v-slot="{ isActive }" class="mx-3" to="/auth/signUp" title="Sign Up">
        <span class="hover:underline" :class="[isActive ? 'text-black' : 'hover:text-gray-500']">Sign up</span>
      </NuxtLink>
      <NuxtLink v-if="isLoggedIn" class="mx-3" to="/user/overview" title="Dashboard">
        <span class="hover:underline" :class="[route.path.includes('user') ? 'text-black' : 'hover:text-gray-500']">{{ userInfo.userName }}'s
          dashboard</span>
      </NuxtLink>
      <Icon
        class="cursor-pointer hover:text-gray-200 align-text-top"
        :name="$colorMode.preference === 'light' ? 'material-symbols:light-mode' : 'material-symbols:dark-mode'"
        @click="setColorMode"
      />
    </div>
  </nav>
</template>
