import component from '@dword-design/vue-component'

export default component({
  asyncData: async ({ $axios, query }) => {
    const svgCode = $axios.$get('/api/dot', { query }) |> await
    return ({
      svgCode,
    })
  },
  render: ({ svgCode }) => <div class="Ov(a)" domPropsInnerHTML={ svgCode } />,
})
