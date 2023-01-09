<template>
<div class="question">
  <span class="question__title" :class="{dop}">{{question.title}}</span>
</div>
</template>

<script>
export default {
  name: "TheQuestion",
  props: {
    dop: {
      type: Boolean,
      default: () => false
    },
    question: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped>
.question__title{
  font-size: 24px;
  font-weight: bold;
  color: var(--color-text);
}
.dop {
  font-size: 18px;
}

@media (min-width: 768px) {
  .question__title{
    font-size: 34px;
  }
  .dop {
    font-size: 24px;
  }
}
</style>
