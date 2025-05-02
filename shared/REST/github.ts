import { Octokit } from 'octokit'
const repoConfig = {
  username: 'DoniLite',
  type: 'owner' as const
}
export class GITHUB_CLIENT {
  #fetcher: Octokit
  constructor(config: Record<string, unknown>) {
    this.#fetcher = new Octokit(config)
  }
  private static otk = new Octokit()
  public static loadRepository = async () => {
    const repos = await this.otk.rest.repos.listForUser(repoConfig)
    return repos
  }
  async fetchRepos() {
    const res = await this.#fetcher.rest.repos.listForUser(repoConfig)
    return res
  }
}
