import {State} from '../../src/models/state'
import {assert} from 'chai'

describe('state test suite', function () {
  beforeEach(() => State.init())

  it('should increase counters', function () {
    assert.equal(State.inc('foo'), 1)
    assert.equal(State.get('foo'), 1)
    State.inc('foo')
    assert.equal(State.get('foo'), 2)
    State.inc('foo', 2)
    assert.equal(State.get('foo'), 4)
  })

  it('should decrease counters', function () {
    State.set('foo', 4)
    State.dec('foo')
    assert.equal(State.get('foo'), 3)
    State.dec('foo', 2)
    assert.equal(State.get('foo'), 1)

  })

  it('should set keys', function () {
    State.set('foo.bar', 'abc')
    assert.equal(State.get('foo.bar'), 'abc')
    assert.deepEqual(State.get('foo'), {bar: 'abc'})
  })
})
