import test from 'ava'
import { fizzbuzz } from './fizzbuzz.js'

test("it returns fizz on 3", t => {
    const result = fizzbuzz(3)
    t.is(result, "fizz")
})

test("it returns buzz on 5", t => {
    const result = fizzbuzz(5)
    t.is(result, "buzz")
})

test("it returns buzz on 10", t => {
    const result = fizzbuzz(10)
    t.is(result, "buzz")
})

test("it returns fizz on 6", t => {
    const result = fizzbuzz(6)
    t.is(result, "fizz")
})

test("it returns fizzbuzz on 15", t => {
    const result = fizzbuzz(15)
    t.is(result, "fizzbuzz")
})

test("it returns the number on 2", t => {
    const result = fizzbuzz(2)
    t.is(result, 2)
})

test("it returns fizzbuzz on 30", t => {
    const result = fizzbuzz(30)
    t.is(result, "fizzbuzz")
})