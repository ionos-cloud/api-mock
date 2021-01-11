import { Sandbox } from '../../src/utils/sandbox'
import { assert } from 'chai'
import registry from '../../src/services/symbol-registry'

describe('sandbox run works', function () {
  it('should evaluate booleans', function () {
    const sandbox = new Sandbox({foo: 'abc'})
    assert.equal(sandbox.run('return foo === "abc"'), true)
  })

  it('should correctly access sandbox data', function () {
    const sandbox = new Sandbox({a: 1, b: 2})
    assert.equal(sandbox.run('return a + b'), 3)
  })

  it('should have access to the registry', function () {
    registry.save('test', {a: 1, b: 2})
    const sandbox = new Sandbox({})
    assert.equal(sandbox.run('return test.a + test.b'), 3)
  })

  it('should not access global scope', function () {
    const sandbox = new Sandbox({})
    assert.equal(sandbox.run('return sandboxRun'), undefined)
  })
})
