import dotenv from 'dotenv'
import { Octokit } from 'octokit'
dotenv.config()

const repoConfig = {
  username: 'DoniLite',
  type: 'owner' as const
}

export interface LoadReposConfig {
  per_page?: number
  sort?: 'created' | 'updated' | 'pushed' | 'full_name'
  direction?: 'asc' | 'desc'
  visibility?: 'all' | 'public' | 'private'
  type?: 'all' | 'owner' | 'member'
}

export class GITHUB_CLIENT {
  #fetcher: Octokit
  constructor(config?: Record<string, unknown>) {
    this.#fetcher = new Octokit(config)
  }

  private static otk = new Octokit({ auth: process.env.GITHUB_TOKEN })

  /**
   * Fetch repositories with flexible options.
   * @param options { visibility, per_page, sort, direction }
   */
  public static async loadRepository(options: LoadReposConfig = {}) {
    const repos = await this.otk.rest.repos.listForUser({
      ...repoConfig,
      visibility: 'public',
      ...options
    })
    return repos.data
  }

  async fetchRepos(options: LoadReposConfig = {}) {
    const res = await this.#fetcher.rest.repos.listForUser({
      ...repoConfig,
      visibility: 'public',
      ...options
    })
    return res.data
  }

  async request<T>(url: string, options?: Record<string, unknown>) {
    const res = await this.#fetcher.request(url, options)
    return res.data as T
  }
}
