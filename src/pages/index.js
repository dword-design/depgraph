import component from '@dword-design/vue-component'
import Toolbar from '../components/toolbar'
import { split, last } from '@dword-design/functions'

export default component({
  middleware: ({ route, redirect }) => {
    if (route.name === 'index') {
      return redirect({ name: 'index-dagre' })
    }
  },
  render: ({ $route, $router }) => {
    const engineName = $route.name |> split('-') |> last
    const layoutName = $route.query.layout ?? 'directed'
    const isDuplicated = [true, 'true'].includes($route.query.duplicated)
    const isClusters = [true, 'true'].includes($route.query.clusters)
    return <div class="D(f) H(100%) Fld(c) Bg(#fafafa) Ff(sans)">
      <Toolbar
        class="Fxs(0) Z(1)"
        engine-name={ engineName }
        layout-name={ layoutName }
        is-duplicated={ isDuplicated }
        is-clusters={ isClusters }
        on-layout-name-change={ layoutName => $router.push({ query: { ...$route.query, layout: layoutName } }) }
        on-is-duplicated-change={ isDuplicated => $router.push({ query: { ...$route.query, duplicated: isDuplicated } }) }
        on-is-clusters-change={ isClusters => $router.push({ query: { ...$route.query, clusters: isClusters } }) }
      />
      <nuxt-child class="H(100%)" />
    </div>
  },
})
