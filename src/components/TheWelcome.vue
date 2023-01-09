<script>
import {useStore} from "vuex";
import {computed} from "vue";

export default {
  setup () {
    const store = useStore()

    return {
      user: computed(() => store.state.test.user),
      setUser: (user) => store.dispatch('test/setUser', user)
    }
  },

  data() {
    return {
      userName: '',
      userEmail: '',
      notFilled: false,
      badEmail: false,
    }
  },

  methods: {
    handleStartClick(){
      if(this.userName !== '' && this.userEmail !== '' && this.validateEmail(this.userEmail)){
        this.notFilled = false
        this.badEmail = false
        this.setUser({
          name: this.userName,
          email: this.userEmail,
        })
        this.$router.push('/test')

      } else {
        if(this.userName === '' && this.userEmail === '') {
          this.notFilled = true
          this.badEmail = false
        } else if (this.userName === '' && this.userEmail !== ''){
          this.notFilled = true
          this.badEmail = false
        } else if (this.userName !== '' && this.userEmail !== '' && !this.validateEmail(this.userEmail)){
          this.notFilled = false
          this.badEmail = true
        }

      }
    },
    validateEmail(email) {
      return String(email)
          .toLowerCase()
          .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
    }
  }
}
</script>

<template>
  <div class="greetings">
    <div class="greetings__b1 greetings__b">
      <h1 class="">NEO-ДИАГНОСТИКА</h1>
    </div>
    <div class="greetings__b2 greetings__b mt-4">
      <div class="greetings-form">
        <input type="text" class="greetings-form__input" placeholder="Ваше имя" v-model="userName">
        <input type="text" class="greetings-form__input" placeholder="Ваш email" v-model="userEmail">
        <button type="button" class="btn greetings-form__button" @click="handleStartClick">Начать тест</button>
        <div v-if="notFilled" class="not-filled">
          Заполните форму, чтобы начать тест
        </div>
        <div v-if="badEmail" class="not-filled">
          Укажите ваш email
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 700;
  font-size: 2.6rem;
  top: -10px;
  line-height: 2.5rem;

}

h3 {
  font-size: 1.2rem;
}

.greetings{
  display: flex;
  flex-direction: column;
  width: 100%;
}
.greetings-form {
  display: flex;
  flex-direction: column;
  background: white;
  width: 100%;
  padding: 1rem;
  border-radius: 26px;
  gap: 1rem;
  box-shadow: 8px 10px 4px 0px #00000040;

}

.greetings-form .not-filled{
  color: #ffb800;
}

.greetings-form .greetings-form__input {
  padding: 1rem;
  border-radius: 15px;
  border: 1px solid var(--color-border);
  width: 100%;
}
.greetings-form .greetings-form__button {
  padding: 1rem;
  border: none;
  border-radius: 15px;
  background: var(--color-primary);
  color: white;
  cursor: pointer;
}
.greetings__b{
  display: flex;
  align-items: center;
  justify-content: center;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 768px) {
  h1 {

  }
  .greetings-form{
    width: 440px;
    padding: 60px 80px;
  }
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
