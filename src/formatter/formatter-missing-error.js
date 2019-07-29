export default class extends Error {
  constructor(name) {
    super(`A formatter with name ${name} does not exist.`)
  }
}
