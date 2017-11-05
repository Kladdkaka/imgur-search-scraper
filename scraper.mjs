import axios from 'axios'
import cheerio from 'cheerio'
import minimist from 'minimist'
import fs from 'fs-extra'

import logger from './logger'

const argv = minimist(process.argv.slice(2))

if (argv._.length !== 0 || !('q' in argv) || !('o' in argv)) {
    logger.error(`You need to use the -q option with a search term, and the -o option with a output file, '-q "memes" -o "ids.json"`)
    process.exit(1)
}

const { q: query, o: output } = argv

logger.info(`I will scrape for "${query}!"`)

start()

/*
    Functions
*/

async function start() {
    try {
        const ids = await getAllPosts(query)

        logger.info(`I am done! I got ${ids.length}x ids!`)

        await fs.writeJSON(output, ids)
        process.exit(0)
    } catch (error) {
        logger.error(error)
    }
}

async function getPostsForPage(query, page) {
    try {
        const res = await axios.get(`https://imgur.com/search/score/all/page/${page}?scrolled&q=${query}`)
        const html = res.data
        const $ = cheerio.load(html)

        return $('.posts .post').map((index, element) => $(element).attr('id')).get()
    } catch (error) {
        throw error
    }
}

async function getAllPosts(query, page = 0, ids = []) {
    try {
        while (true) {
            logger.info(`Loading page #${page} for "${query}"!`)

            const new_ids = await getPostsForPage(query, page)

            logger.info(`Loaded! Got ${new_ids.length}x posts for page #${page} for query "${query}"!`)

            if (new_ids.length === 0) {
                break
            }

            ids.push(...new_ids)
            page++
        }
        return ids
    } catch (error) {
        throw error
    }
}