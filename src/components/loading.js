import component from '@dword-design/vue-component'
import Spinner from 'vue-spinner/src/BeatLoader.vue'
import variables from '../variables.config'

const { primaryColor } = variables

export default component({
  data: () => ({
    loading: false,
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    },
  },
  render: ({ loading }) =>
    <transition name="fade">
      { loading &&
        <div class="StretchedBox Bg(#fff.5)">
          <Spinner
            class="Pos(a) Start(50%) T(30%) Fxd(r) Translate(-50%, -50%)"
            color={ primaryColor }
          />
        </div>
      }
    </transition>,
})