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
{
  name: 'video.js',
  var: 'videojs',
  path: 'https://unpkg.com/video.js@8.21.0/dist/video.min.js',
},
{
  name: 'xlsx',
  var: 'XLSX',
  path: 'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js',
},
{
  name: 'echarts',
  var: 'echarts',
  path: 'https://unpkg.com/echarts@5.4.3/dist/echarts.min.js',
},

]
export default cdnConfigs
