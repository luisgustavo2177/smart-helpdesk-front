import { createTheme, type MantineColorsTuple } from '@mantine/core'

/** Verde institucional Fadex (#9ACA3C), com as 10 variações exigidas pelo Mantine. */
const brand: MantineColorsTuple = [
  '#f5faec',
  '#e6f4cd',
  '#d5edab',
  '#c3e587',
  '#b4de68',
  '#a5d652',
  '#9aca3c',
  '#84b232',
  '#6d9929',
  '#57801f',
]

const timesNewRoman = '"Times New Roman", Times, serif'

export const theme = createTheme({
  primaryColor: 'brand',
  colors: { brand },
  autoContrast: true,
  fontFamily: timesNewRoman,
  fontFamilyMonospace: timesNewRoman,
  headings: { fontFamily: timesNewRoman },
})
