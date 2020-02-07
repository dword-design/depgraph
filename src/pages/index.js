import component from '@dword-design/vue-component'
import Toolbar from '../components/toolbar'
import { split, last } from '@dword-design/functions'

export default component({
  data: () => ({
    modules: [],
    dependencies: [],
    engineName: undefined,
    layoutName: undefined,
    isDuplicated: false,
    isClusters: false,
  }),
  render: ({ $route, $router }) => {
    const engineName = $route.name |> split('-') |> last
    const layoutName = $route.query.layout ?? 'directed'
    const isDuplicated = $route.query.duplicated === 'true'
    const isClusters = $route.query.clusters === 'true'
    return <div class="D(f) H(100%) Fld(c) Bg(#fafafa) Ff(sans)">
      <Toolbar
        class="Fxs(0) Z(1)"
        engine-name={ engineName }
        layout-name={ layoutName }
        is-duplicated={ isDuplicated }
        is-clusters={ isClusters }
        on-engine-name-change={ engineName => $router.push({ to: 'engine', params: { engine: engineName } }) }
        on-layout-name-change={ layoutName => $router.push({ query: { ...$route.query, layout: layoutName } }) }
        on-is-duplicated-change={ isDuplicated => $router.push({ query: { ...$route.query, duplicated: isDuplicated } }) }
        on-is-clusters-change={ isClusters => $router.push({ query: { ...$route.query, clusters: isClusters } }) }
      />
      <nuxt-child class="H(100%)" />
    </div>
  },
})
