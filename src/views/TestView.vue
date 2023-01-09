<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import TheTest from '../components/TheTest.vue'

export default {
  components: {TheTest},

  setup () {
    const store = useStore()

    return {
      questions: computed(() => store.state.test.questions),
      answers: computed(() => store.state.test.answers),
    }
  },

  methods: {
    handleAnswer(answer){

    }
  }
}
</script>

<template>
  <main>
    <TheTest/>
  </main>
</template>
