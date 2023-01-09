<template>
  <h1 class="title">Neo-диагностика</h1>
  <div v-if="firstStep && !fin" class="test mt-4">
    <div class="test-question">
      <div class="test-question__counter">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</div>
      <div class="test-question__subtitle">Насколько вам соответствует данное утверждение?</div>
      <transition name="fade" mode="out-in">
        <the-question :question="currentQuestion" :key="currentQuestion.id"/>
      </transition>
    </div>
    <div class="test-answers">
      <div class="test-question__subtitle">Выберите вариант ответа</div>
      <button
          type="button"
          class="answer"
          :class="{active: answerVariant === selectedAnswerVariant}"
          v-for="answerVariant in answerVariants"
          :key="answerVariant.id"
          @click="handleAnswer(answerVariant)"
          @keydown="setAnswerFromKeyboard"
      >
        <span class="test-question__num">{{ answerVariant.id }}.</span> {{ answerVariant.title }}
      </button>
      <button
          type="button"
          class="btn btn-primary btn-apply-answer"
          :key="10"
          @click="handleApplyAnswer()"
          :disabled="!selectedAnswerVariant"
      >Ответить
      </button>
      <div class="btn-group">
        <button
            type="button"
            class="btn btn-white btn-back-forward"
            :key="11"
            @click="toPreviousQuestion()"
            :disabled="currentQuestionIndex === 0"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.70709 9.70711L7.99998 9L5 12L8 15L8.70711 14.2929L6.91416 12.4999L19 12.5L19 11.5L6.91426 11.4999L8.70709 9.70711Z"
                fill="#2E3A59"/>
          </svg>
          Предыдущий вопрос
        </button>
        <button
            type="button"
            class="btn btn-white btn-back-forward"
            :key="12"
            @click="toNextQuestion()"
            :disabled="currentQuestionIndex === answers.length"
        >
          Следующий вопрос
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15.2929 14.2929L16 15L19 12L16 9L15.2929 9.70711L17.0858 11.5L5 11.5V12.5L17.0857 12.5L15.2929 14.2929Z"
                fill="#2E3A59"/>
          </svg>
        </button>
      </div>
      <button
          v-if="user.name === 'test'"
          type="button"
          class="btn btn-primary btn-apply-answer"
          :key="10"
          @click="fillTest()"
      >Автозаполнение теста
      </button>
    </div>
  </div>
  <div v-if="secondStep && !fin" class="test mt-4">
    <div class="test-question">
      <div class="test-question__counter">Дополнительные вопросы {{ currentDopQuestionIndex + 1 }} / {{ activeDopQuestions.length }}</div>
      <div class="test-question__subtitle">Насколько вам соответствует данное утверждение?</div>
      <transition name="fade" mode="out-in">
        <the-question dop :question="currentDopQuestion" :key="currentDopQuestion.id"/>
      </transition>
    </div>
    <div class="test-answers">
      <div class="test-question__subtitle">Выберите вариант ответа</div>
      <button
          type="button"
          class="answer"
          :class="{active: answerVariant === selectedAnswerVariant}"
          v-for="answerVariant in answerVariants"
          :key="answerVariant.id"
          @click="handleDopQuestionAnswer(answerVariant)"
          @keydown="setDopQuestionAnswerFromKeyboard"
      >
        <span class="test-question__num">{{ answerVariant.id }}.</span> {{ answerVariant.title }}
      </button>
      <button
          type="button"
          class="btn btn-primary btn-apply-answer"
          :key="10"
          @click="handleApplyDopAnswer()"
          :disabled="!selectedAnswerVariant"
      >Ответить
      </button>
      <div class="btn-group">
        <button
            type="button"
            class="btn btn-white btn-back-forward"
            :key="11"
            @click="toPreviousDopQuestion()"
            :disabled="currentDopQuestionIndex === 0"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.70709 9.70711L7.99998 9L5 12L8 15L8.70711 14.2929L6.91416 12.4999L19 12.5L19 11.5L6.91426 11.4999L8.70709 9.70711Z"
                fill="#2E3A59"/>
          </svg>
          Предыдущий вопрос
        </button>
        <button
            type="button"
            class="btn btn-white btn-back-forward"
            :key="12"
            @click="toNextDopQuestion()"
            :disabled="currentDopQuestionIndex === dopAnswers.length"
        >
          Следующий вопрос
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15.2929 14.2929L16 15L19 12L16 9L15.2929 9.70711L17.0858 11.5L5 11.5V12.5L17.0857 12.5L15.2929 14.2929Z"
                fill="#2E3A59"/>
          </svg>
        </button>
      </div>
      <button
          v-if="user.name === 'test'"
          type="button"
          class="btn btn-primary btn-apply-answer"
          :key="20"
          @click="fillDopTest()"
      >Автозаполнение теста
      </button>
    </div>
  </div>
</template>

<script>
import TheQuestion from "./TheQuestion.vue"
import TheResults from "./TheResults.vue"
import {useStore} from "vuex";
import {computed} from "vue";
import {getResultTable, getDestructiveGroupsIds} from "../js/test";

export default {
  components: {TheQuestion, TheResults},

  setup() {
    const store = useStore()

    return {
      user: computed(() => store.state.test.user),
      questions: computed(() => store.state.test.questions),
      groups: computed(() => store.state.test.groups),
      dopQuestions: computed(() => store.state.test.dopQuestions),
      answerVariants: computed(() => store.state.test.answerVariants),
      answers: computed(() => store.state.test.answers),
      dopAnswers: computed(() => store.state.test.dopAnswers),
      clearAnswers: () => store.dispatch('test/clearAnswers'),
      setAnswer: (answer) => store.dispatch('test/setAnswer', answer),
      setDopAnswer: (answer) => store.dispatch('test/setDopAnswer', answer)
    }
  },

  data() {
    return {
      currentQuestionIndex: 0,
      currentDopQuestionIndex: 0,
      selectedAnswerVariant: null,
      selectedDopQuestionAnswerVariant: null,
      fin: false,
      resultTable: [],
      destructiveGroupsIds: [],
      showHtml: false,
    }
  },

  created() {
    if (!this.user.email || !this.user.name) {
      this.$router.push('/')
    }
    this.clearAnswers()
  },

  computed: {
    firstStep(){
      return this.answers.length < 90
    },
    secondStep(){
      return this.answers.length === 90 && this.activeDopQuestions.length > 0
    },
    activeDopQuestions(){
      if(!this.destructiveGroupsIds.length) return []
      return this.dopQuestions.filter( q => this.destructiveGroupsIds.includes(q.gid))
    },
    currentQuestion() {
      return this.questions[this.currentQuestionIndex]
    },
    currentDopQuestion() {
      return this.activeDopQuestions[this.currentDopQuestionIndex]
    },
    results() {
      return this.resultTable
    },
    answersToArray() {
      return this.answers.map(a => a.answerVariantId)
    },
    dopAnswersToArray() {
      return this.dopAnswers.map(a => a.answerVariantId)
    },

  },

  methods: {
    getResultTable() {
      this.resultTable = getResultTable(this.groups, this.answers)
    },
    getDestructiveGroupsIds() {
      this.destructiveGroupsIds = getDestructiveGroupsIds(this.resultTable)
    },
    getUserAnswerVariant() {
      if (this.currentQuestion) {
        let answer = this.answers.find(a => a.questionId === this.currentQuestion.id)
        if (answer) {
          this.selectedAnswerVariant = this.answerVariants.find(a => a.id === answer.answerVariantId)
        } else {
          this.selectedAnswerVariant = null
        }
      }
    },
    getUserDopAnswerVariant() {
      if (this.currentDopQuestion) {
        let answer = this.dopAnswers.find(a => a.questionId === this.currentDopQuestion.id)
        if (answer) {
          this.selectedAnswerVariant = this.answerVariants.find(a => a.id === answer.answerVariantId)
        } else {
          this.selectedAnswerVariant = null
        }
      }
    },
    toPreviousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
        this.getUserAnswerVariant()
      }
    },
    toNextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1 && this.currentQuestionIndex <= this.answers.length - 1) {
        this.currentQuestionIndex++
        this.getUserAnswerVariant()
      }
    },
    toPreviousDopQuestion() {
      if (this.currentDopQuestionIndex > 0) {
        this.currentDopQuestionIndex--
        this.getUserDopAnswerVariant()
      }
    },
    toNextDopQuestion() {
      if (this.currentDopQuestionIndex < this.dopQuestions.length - 1 && this.currentDopQuestionIndex <= this.dopAnswers.length - 1) {
        this.currentDopQuestionIndex++
        this.getUserDopAnswerVariant()
      }
    },
    async fillTest() {
      await this.clearAnswers()
      for (let i = 0; i < this.questions.length; i++) {
        const answerVariantIndex = Math.floor(Math.random() * 6);
        await this.setAnswer({
          questionId: this.questions[i].id,
          gid: this.questions[i].gid,
          answerVariantId: this.answerVariants[answerVariantIndex].id,
          answerWeight: this.answerVariants[answerVariantIndex].weight
        })
      }
      this.getResultTable()
      this.getDestructiveGroupsIds()
      // this.goResults()
    },
    async fillDopTest() {
      for (let i = 0; i < this.activeDopQuestions.length; i++) {
        const answerVariantIndex = Math.floor(Math.random() * 6);
        await this.setDopAnswer({
          questionId: this.dopQuestions[i].id,
          gid: this.dopQuestions[i].gid,
          answerVariantId: this.answerVariants[answerVariantIndex].id,
          answerWeight: this.answerVariants[answerVariantIndex].weight -1
        })
      }
       this.goResults()
    },
    handleAnswer(answerVariant) {
      if (this.currentQuestionIndex <= this.questions.length - 1) {
        this.selectedAnswerVariant = answerVariant
      }
    },
    handleDopQuestionAnswer(answerVariant) {
      if (this.currentDopQuestionIndex <= this.dopQuestions.length - 1) {
        this.selectedAnswerVariant = answerVariant
      }
    },
    async handleApplyAnswer() {
      if (!this.selectedAnswerVariant) return
      if (this.currentQuestionIndex < this.questions.length) {
        const currentQuestion = this.questions[this.currentQuestionIndex]
        await this.setAnswer({
          questionId: currentQuestion.id,
          gid: currentQuestion.gid,
          answerVariantId: this.selectedAnswerVariant.id,
          answerWeight: this.selectedAnswerVariant.weight
        })
        if (this.currentQuestionIndex === this.questions.length - 1) {
          this.getResultTable()
          this.getDestructiveGroupsIds()
        }
        this.currentQuestionIndex++
        this.selectedAnswerVariant = null
      }


      if (this.currentQuestionIndex < this.questions.length - 1 && this.currentQuestionIndex <= this.answers.length - 1) {
        this.getUserAnswerVariant()
      }
    },
    async handleApplyDopAnswer() {
      if (!this.selectedAnswerVariant) return
      if (this.currentDopQuestionIndex < this.activeDopQuestions.length) {
        const currentQuestion = this.activeDopQuestions[this.currentDopQuestionIndex]
        await this.setDopAnswer({
          questionId: currentQuestion.id,
          gid: currentQuestion.gid,
          answerVariantId: this.selectedAnswerVariant.id,
          answerWeight: this.selectedAnswerVariant.weight -1
        })
        if (this.currentDopQuestionIndex === this.activeDopQuestions.length - 1) {
          this.goResults()
        } else {
          this.currentDopQuestionIndex++
          this.selectedAnswerVariant = null
        }
      }

      if (this.currentDopQuestionIndex < this.activeDopQuestions.length - 1 && this.currentDopQuestionIndex <= this.dopAnswers.length - 1) {
        this.getUserDopAnswerVariant()
      }
    },
    goResults() {
      // make url with answers
      this.$router.push({
        name: 'results', query: {
          user_name: this.user.name,
          user_email: this.user.email,
          q: this.answersToArray.join('.'),
          qd: this.dopAnswersToArray.join('.'),
        }
      });
    },

    setAnswerFromKeyboard(e) {
      if (e.key > 0 && e.key < 7) {
        this.handleAnswer(this.answerVariants[e.key - 1])
      }
      if (e.key === 'Enter') {
        this.handleApplyAnswer()
      }

    },
  }
}
</script>

<style scoped>
.test {
  width: 100%;
  display: flex;
  gap: 2rem;
  flex-direction: column;
}

.test-question__counter {
  color: var(--color-text);
  font-size: 32px;
}

.test-question__subtitle {
  color: var(--color-text-second);
  line-height: 1rem;
}

.test-question__num {
  display: none;
  color: var(--color-text-second);
}

.test-answers {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}

.test-question {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.test-answers {
  width: 100%;
}

.answer {
  font-size: 16px;
  padding: 0.75rem 1rem 0.75rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 2rem;
  background: white;
  cursor: pointer;
  text-align: left;
}

.answer.active {
  border-color: #181818;
}

.btn-group {
  display: flex;
  gap: 1rem;
}

.btn {
  font-size: 16px;
}

.btn-back-forward {
  width: 50%;
}

.title {
  display: none;
}


@media (min-width: 768px) {
  .title {
    display: inline;
  }

  .test-question__num {
    display: inline;
  }

  .test {
    flex-direction: row;
  }

  .test-question {
    width: 60%;
  }

  .test-answers {
    width: 40%;
  }
}
</style>
