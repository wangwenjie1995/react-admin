interface cdnConfig {
  name: string,
  var: string,
  path: string
}
const cdnConfigs = [{
  name: 'react',
  var: 'React',
  path: 'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
},
{
  name: 'react-dom',
  var: 'ReactDOM',
  path: 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
},
{
  name: 'axios',
  var: 'axios',
  path: 'https://unpkg.com/axios@1.6.2/dist/axios.min.js',
},
]
export default cdnConfigs
