<template v-if="resultTable" class="results">
  <h1><RouterLink to="/">Neo-диагностика</RouterLink></h1>
  <h2 class="mt-4">Результаты теста {{user.name}} {{user.email}}</h2>
  <div class="results__chart mt-4">
    <apexchart width="100%" :options="getChartOptions()" :series="getChartSeries()" />
  </div>
  <template v-if="resultTable.length">
    <div v-for="(result, index) in resultTable" class="result mt-4">
      <div class="result__diagram block-white">
        <h3>{{result.title}}</h3>
        <apexchart width="100%" type="radialBar" :options="getBarOptions(result)" :series="getBarSeries(result)" />
        <p>{{getTpTitle(result.tp)}}</p>
      </div>
      <div class="result__text block-white">
        <h5 class="result__text-title">"{{result.descriptionTitle}}"</h5>
        <p>{{result.description}}</p>
        <div v-if="destructiveProgram(index)">
          <template v-for="dopRes in getGroupDopQuestionsVsResults(result.id)">
            <h5>{{dopRes.copingTitle}}  : {{dopRes.rating}} из 5</h5>
            <span>{{dopRes.title}}</span>
          </template>
        </div>
      </div>
    </div>
  </template>
  <div v-if="resultTable.length" id="email" style="display: none;">
    <div style="background: #f8f8f8;">
      <div style="margin: 0 auto; padding: 48px; background: white; border-radius: 10px;">
        <h1>Neo-диагностика</h1>
        <h3>Результаты тестирования</h3>
        <p style="margin-top: 2rem;">Имя: {{user.name}}</p>
        <template v-if="resultTable.length">
          <div v-for="(result, index) in resultTable" style="margin-top: 40px;">
            <div>
              <h1>{{result.title}} <span  style="color:#aaa;">({{result.s}} из 30)</span></h1>
              <p>{{getTpTitle(result.tp)}}</p>
              <h5>"{{result.descriptionTitle}}"</h5>
              <p>{{result.description}}</p>
              <div v-if="destructiveProgram(index)">
                <template v-for="dopRes in getGroupDopQuestionsVsResults(result.id)">
                  <h5>{{dopRes.copingTitle}}  : {{dopRes.rating}} из 5</h5>
                  <span>{{dopRes.title}}</span>
                </template>
              </div>
            </div>
          </div>
        </template>
        <div style="margin-top: 2rem; text-align: center;">
          <a style="padding: 1rem; background: #000; color: white; border-radius: 5px; text-decoration: none;" target="_blank" :href="getResultsPath()">Смотреть результаты</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {computed} from "vue";
import {getDestructiveGroupsIds, getResultTable, isDestructiveProgram} from "../js/test";

export default {

  setup () {
    const store = useStore()
    return {
      user: computed(() => store.state.test.user),
      dopQuestions: computed(() => store.state.test.dopQuestions),
      groups: computed(() => store.state.test.groups),
      answers: computed(() => store.state.test.answers),
      dopAnswers: computed(() => store.state.test.dopAnswers),
      setAnswersFromArray: (answers) => store.dispatch('test/setAnswersFromArray', answers),
      setDopAnswersFromArray: (answers) => store.dispatch('test/setDopAnswersFromArray', answers),
      setUser: (user) => store.dispatch('test/setUser', user)
    }
  },

  data () {
    return {
      options: {
        labels: ['progress'],
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 0,
              size: "60%"
            },

            dataLabels: {
              showOn: "always",
              name: {
                offsetY: 10,
                show: true,
                color: "#000",
                fontSize: "24px"
              },
              value: {
                color: "#111",
                fontSize: "10px",
                show: false
              }
            }
          }
        },
      },
      destructiveGroupsIds: [],
      fromUrl: false,
    }
  },

  created(){
    if(!this.user.name) {
      const user = {
        name: this.$route.query.user_name ?? '',
        email: this.$route.query.user_email ?? '',
      }
      this.setUser(user)

      // how we are entered this page
      this.fromUrl = true
    }
    if(!this.answers.length && this.$route.query.q){
      const answersFromUrl = this.$route.query.q
      this.setAnswersFromArray(answersFromUrl.split('.'))
    }
    if(!this.dopAnswers.length && this.$route.query.qd){
      this.getDestructiveGroupsIds()
      const answersFromUrl = this.$route.query.qd
      this.setDopAnswersFromArray({
        questions: this.activeDopQuestions,
        answers: answersFromUrl.split('.')})
    }
  },
  mounted() {
    if(!this.fromUrl){
      this.sendResultsToEmail()
    }
  },

  computed: {
    resultTable() {
      return getResultTable(this.groups, this.answers)
    },
    activeDopQuestions(){
      if(!this.destructiveGroupsIds.length) return []
      return this.dopQuestions.filter( q => this.destructiveGroupsIds.includes(q.gid))
    },
    answersToArray() {
      return this.answers.map(a => a.answerVariantId)
    },
    dopAnswersToArray() {
      return this.dopAnswers.map(a => a.answerVariantId)
    },
  },

  methods: {
    getResultsPath(){
      return window.location.origin + this.$router.resolve({
        name: 'results', query: {
          user_name: this.user.name,
          user_email: this.user.email,
          q: this.answersToArray.join('.'),
          qd: this.dopAnswersToArray.join('.'),
        }
      }).fullPath;
    },
    destructiveProgram(index){
      return isDestructiveProgram(this.resultTable, index)
    },
    getDestructiveGroupsIds() {
      this.destructiveGroupsIds = getDestructiveGroupsIds(this.resultTable)
    },
    getBarOptions(result){
      return {
        labels: [
          result.s + ' из ' + 30
        ],
        plotOptions: this.options.plotOptions,
        stroke: {
          lineCap: "round",
        },
      }
    },
    getBarSeries(result){
      return [100 * result.s / 30]
      // return [result.s1]
    },
    getChartOptions(){
      return {
        chart: {
          type: 'bar'
        },
        legend: {
          show: false,
        },
        grid: {
          show: false,
        },
        plotOptions: {
          bar: {
            borderRadius: 15,
            borderRadiusApplication: 'around',
            borderRadiusWhenStacked: 'last',
            barHeight: '85%',
            distributed: false,
            horizontal: true,
            dataLabels: {
              position: 'bottom'
            },
            colors: {
              ranges: [{
                from: 0,
                to: 0,
                color: '#fff'
              }],
              backgroundBarColors: [],
              backgroundBarOpacity: 1,
              backgroundBarRadius: 0,
            },
          }
        },
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#fff'],
            fontSize: 16,
          },
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
          },
          offsetX: 0,
          dropShadow: {
            enabled: false
          }
        },
        xaxis: {
          labels: {
            show: false
          },
          categories: this.resultTable.map(r => r.title.split('/')[0])
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function () {
                return ''
              }
            }
          }
        }
      }
    },
    getChartSeries(){
      return [{
        name: 'Показатель',
        data: this.resultTable.map(r => r.s)
      }]
    },

    getGroupDopQuestionsVsResults(groupId){
      let res = this.dopAnswers
          .filter(q => {
            return q.gid === groupId && q.answerWeight > 0
          })
          .map( q => {
            const question = this.dopQuestions.find( i => i.id === q.questionId)
            return {
              questionId: q.questionId,
              rating: q.answerWeight,
              gid: q.gid,
              coping: question.coping,
              copingTitle: this.getCopingTitle(question.coping),
              title: question.title
            }
          })
      return res.sort((a,b) => b.rating - a.rating)
    },

    getCopingTitle(copingId){
      let res = 'Бей';
      switch(copingId){
        case 1: res = 'Бей'; break;
        case 2: res = 'Беги'; break;
        case 3: res = 'Замри'; break;
      }
      return res
    },

    getTpTitle(tp){
      let res = 'Низкий показатель';
      switch(tp){
        case 0: res = 'Низкий показатель'; break;
        case 1: res = 'Пониженный показатель'; break;
        case 2: res = 'Средний показатель'; break;
        case 3: res = 'Повышенный показатель'; break;
        case 4: res = 'Высокий показатель'; break;
      }
      return res
    },
    getEmailBodyHtml(){
      const el = document.getElementById('email');
      return el.innerHTML
    },
    async sendResultsToEmail() {
      const data = {
        "name": this.user.name,
        // "email": 'inkas_art@mail.ru',
        "email": this.user.email,
        "html": this.getEmailBodyHtml()
      }
      try {
        await fetch('https://neo-diagnostics.ru/api/test/finish', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Ошибка:', error);
      }

    },
    getDescription(){

    }
  }
}
</script>

<style scoped>
  h1, h2, h3{
    font-weight: bold;
    line-height: 1.75rem;
  }
  p {
    display: inline-block;
    line-height: 2rem;
    font-weight: normal;
    margin-top: 1rem;
  }
  .results__chart{
    display: none;
    background: #fff;
    border-radius: 1rem;
  }
  .result {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    background: rgba(255, 255, 255, 0.75);
    padding: 2rem;
    border-radius: 1rem;
  }
  .block-white {

  }
  .result__diagram {
    display: flex;
    flex-direction: column;
    justify-content: start;
    text-align: center;
  }
  .result__text {
    font-weight: normal;
  }
  .result__text-title {
    font-size: 24px;
    font-style: italic;
  }
  a{
    color: var(--color-text);
  }
  @media (min-width: 768px) {
    .test-question__num{
      display: inline;
    }
    .results__chart {
      display: block;
    }
    .result {
      flex-direction: row;
      padding: 0;
    }
    .result__diagram {
      width: 30%;
      text-align: center;
    }
    .result__text {
      width: 70%;
    }
    .block-white {
      background: rgba(255, 255, 255, 0.75);
      padding: 2rem;
      border-radius: 1rem;
    }
  }
</style>
