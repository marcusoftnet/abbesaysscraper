const cheerio = require('cheerio')
const SITE = 'http://abbesays.apphb.com'

const getData = async url => {
  try {
    const axios = require('axios')
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.log(`Failed getting ${url} - ${error}`)
    throw error
  }
}
// getData(getKidUrl('Albert')).then(console.log)

const getKidUrl = kid => `${SITE}/Quotes/Kid/${kid}`

const parseLinks = async htmlString => {
  try {
    const $ = await cheerio.load(htmlString)

    return $('blockquote > a')
      .map((i, link) => `${SITE}${$(link).attr('href')}`)
      .toArray()
  } catch (error) {
    console.log(error)
  }
}

//getData(getKidUrl('Albert')).then(parseLinks).then(console.log)
