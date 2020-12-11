const express = require('express')
const router = express.Router()

const books = [{ id: 1, name: 'Foo' }]
let maxId = 1

/**
 * getting all books
 */
router.get('/', async (req, res) => {
  // 获取 query 参数
  const name = req.query.name
  const match = (name) ? books.filter((book) => book.name === name) : books

  res.send(match)
})

/**
 * getting only one book by id
 */
router.get('/:id', (req, res) => {
  // 获取 path 参数
  const id = +req.params.id
  const match = books.find((book) => book.id === id)

  console.log(books)

  res.send(match)
})

/**
 * add a new book to the list
 */
router.post('/', (req, res) => {
  // 获取 json body
  const book = req.body
  book.id = ++maxId
  books.push(book)

  res.send(`Got a book ${JSON.stringify(book)}`)
})

/**
 * updating the existing book
 */
router.put('/', (req, res) => {
  const book = req.body
  const existing = books.find((existing) => book.id === existing.id)

  if (existing === null) {
    res.send('Not Found')
  } else {
    Object.assign(existing, book)

    res.send(`Update book ${JSON.stringify(book)}`)
  }
})

/**
 * remove the book from the list
 */
router.delete('/:id', (req, res) => {
  const index = books.findIndex((book) => book.id === +req.params.id)

  if (index === -1) {
    res.send('Not Found')
  } else {
    const deleted = books[index]
    books.splice(index, 1)

    res.send(`Deleted book ${JSON.stringify(deleted)}`)
  }
})

module.exports = router
