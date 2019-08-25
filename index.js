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

// getData(getKidUrl('Albert')).then(parseLinks).then(console.log)

const getQuoteHtmlString = async link => getData(link)

const parseQuoteDate = kidInfoString => kidInfoString.split(';')[0].split(' ')[1]
const parseKidName = kidInfoString => kidInfoString.split(' av ')[1].split('\n')[0]
const parseAgeAtQuote = kidInfoString => kidInfoString.split('\n')[1].trim()

const parseQuote = async htmlString => {
  const $ = await cheerio.load(htmlString)
  const quoteText = $('blockquote > p').text().trim()
  const kidInfo = $('#contentMain > div > p:nth-child(2)').text().trim()

  return {
    quoteText: quoteText,
    quoteDate: parseQuoteDate(kidInfo),
    kidName: parseKidName(kidInfo),
    ageAtQuote: parseAgeAtQuote(kidInfo)
  }
}
// getQuoteHtmlString('http://abbesays.apphb.com/Quotes/77').then(parseQuote).then(console.log)

const getQuotes = async links => {
  const parsedQuotesPromises =
    links.map(async link => {
      console.log(`${link} being processed`)
      const quoteHtml = await getQuoteHtmlString(link)
      return parseQuote(quoteHtml)
    })

  return Promise.all(parsedQuotesPromises)
}

const kids = ['Albert', 'Arvid', 'Gustav']

Promise.all(
  kids.map(async kid =>
    getData(getKidUrl(kid))
      .then(parseLinks)
      .then(getQuotes)
  ))
  .then(kidQuotes => kidQuotes.flat())
  .then(console.table)
