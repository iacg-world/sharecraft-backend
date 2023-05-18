import 'iacg-block/dist/iacg-block.css'
import IacgBlock from 'iacg-block'
import { createSSRApp } from 'vue'

const vueApp = createSSRApp({
  data: () => {
    return {
      components: window.COMPONENT_DATA || []
    }
  },
  template: '<final-page :components="components"></final-page>'
})
vueApp.use(IacgBlock)
vueApp.mount('#app')
