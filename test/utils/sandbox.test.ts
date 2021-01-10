import { sandboxRun } from '../../src/utils/sandbox'
import { assert } from 'chai'
import registry from '../../src/services/symbol-registry'

describe('sandbox run works', function () {
  it('should evaluate booleans', function () {
    assert.equal(sandboxRun('return foo === "abc"', {foo: 'abc'}), true)
  })

  it('should correctly access sandbox data', function () {
    assert.equal(sandboxRun('return a + b', {a: 1, b: 2}), 3)
  })

  it('should have access to the registry', function () {
    registry.save('test', {a: 1, b: 2})
    assert.equal(sandboxRun('return test.a + test.b'), 3)
  })

  it('should not access global scope', function () {
    assert.equal(sandboxRun('return sandboxRun'), undefined)
  })
})
