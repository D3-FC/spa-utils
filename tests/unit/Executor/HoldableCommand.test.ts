import HoldableCommand from '../../../src/modules/Command/HoldableCommand'
import { sleep } from '../../../src/modules/AsyncHelpers'

describe('HoldExecutor', () => {
  it('should run command only once', async (done) => {
    let runsCount = 0
    const executor = new HoldableCommand(async () => {
      runsCount++
      await sleep(5)
      return runsCount
    })

    const firstRun = await executor.run()
    expect(firstRun).toBe(1)

    const secondRun = await executor.run()
    expect(firstRun).toBe(1)

    const thirdRun = await executor.run()
    expect(firstRun).toBe(1)

    Promise.all([firstRun, secondRun, thirdRun]).then(() => done())
  })
})
