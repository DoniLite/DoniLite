import { Octokit } from 'octokit'
const repoConfig = {
  username: 'DoniLite',
  type: 'owner' as const
}
export class GITHUB_CLIENT {
  #fetcher: Octokit
  constructor(config?: Record<string, unknown>) {
    this.#fetcher = new Octokit(config)
  }
  private static otk = new Octokit({ auth: process.env.GITHUB_TOKEN })
  public static loadRepository = async () => {
    const repos = await this.otk.rest.repos.listForUser(repoConfig)
    return repos.data
  }
  async fetchRepos() {
    const res = await this.#fetcher.rest.repos.listForUser(repoConfig)
    return res.data
  }
  async request<T>(url: string, options?: Record<string, unknown>) {
    const res = await this.#fetcher.request(url, options)
    return res.data as T
  }
}
