<template>
  <div class="fixed w-screen h-screen flex justify-center items-center bg-black/80">
    <Transition name="bounceOut" appear>
      <slot></slot>
    </Transition>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
