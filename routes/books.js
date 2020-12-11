const fs = require('fs/promises')
const express = require('express')
const router = express.Router()

const BOOKS_FILE = 'books.json'

async function getBooks () {
  const json = await fs.readFile(BOOKS_FILE, 'utf-8')
  return JSON.parse(json)
}

async function setBooks (json) {
  await fs.writeFile(BOOKS_FILE, JSON.stringify(json))
}

/**
 * getting all books
 */
router.get('/', async (req, res) => {
  // 获取 query 参数
  const name = req.query.name
  const existing = await getBooks()
  const match = (name) ? existing.filter((book) => book.name === name) : existing

  res.send(match)
})

/**
 * getting only one book by id
 */
router.get('/:id', async (req, res) => {
  // 获取 path 参数
  const id = +req.params.id
  const existing = await getBooks()
  const match = existing.find((book) => book.id === id)

  res.send(match)
})

/**
 * add a new book to the list
 */
router.post('/', async (req, res) => {
  // 获取 json body
  const book = req.body
  const existing = await getBooks()
  const maxId = Math.max.apply(null, existing.map((book) => book.id))
  book.id = maxId + 1
  existing.push(book)
  await setBooks(existing)

  res.send(`Got a book ${JSON.stringify(book)}`)
})

/**
 * updating the existing book
 */
router.put('/', async (req, res) => {
  const book = req.body

  const existing = await getBooks()
  const found = existing.find((existing) => book.id === existing.id)

  if (found) {
    Object.assign(found, book)
    await setBooks(existing)

    res.send(`Update book ${JSON.stringify(book)}`)
  } else {
    res.send('Not Found')
  }
})

/**
 * remove the book from the list
 */
router.delete('/:id', async (req, res) => {
  const existing = await getBooks()
  const index = existing.findIndex((book) => book.id === +req.params.id)

  if (index === -1) {
    res.send('Not Found')
  } else {
    const deleted = existing[index]
    existing.splice(index, 1)
    await setBooks(existing)

    res.send(`Deleted book ${JSON.stringify(deleted)}`)
  }
})

module.exports = router
