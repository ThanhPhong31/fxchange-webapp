import client from '@/graphql'
import stuffQuery from '@/graphql/queries/stuff-query'
import { locale } from '@/libs/locale'
import { User } from '@/types/model'

class StuffServices {
  public async getMyStuff(user: User | null) {
    try {
      if (!user) return
      const response = await client.query({
        query: stuffQuery.getMyStuff(),
      })

      if (!response) throw new Error(locale.vi.manageStuff.read.error)

      return response
    } catch (e) {
      throw e
    }
  }
}

export default new StuffServices() as StuffServices
