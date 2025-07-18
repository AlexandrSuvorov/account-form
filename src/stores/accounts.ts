import { defineStore } from 'pinia'

export type AccountType = 'LDAP' | 'Локальная'

export interface Account {
  id: string,
  labels: { text: string }[],
  type: AccountType,
  login: string,
  password: string | null,
  errors?: Record<string, string>
}

function parseLabels(str: string): { text: string }[] {
  return str.split(';').map(label => label.trim()).filter(Boolean).map(text => ({ text }))
}

export const useAccountStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    load() {
      const raw = localStorage.getItem('accounts')
      if (raw) this.accounts = JSON.parse(raw)
    },
    save() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts))
    },
    addAccount() {
      this.accounts.push({
        id: Math.random().toString(36).slice(2),
        labels: [],
        type: 'LDAP',
        login: '',
        password: null,
        errors: {}
      })
      this.save()
    },
    removeAccount(id: string) {
      this.accounts = this.accounts.filter(acc => acc.id !== id)
      this.save()
    },
    updateAccount(id: string, field: string, value: string) {
      const acc = this.accounts.find(acc => acc.id === id)
      if (!acc) return
      if (field === 'labels') {
        acc.labels = parseLabels(value).slice(0, 50)
      } else if (field === 'type') {
        acc.type = value as AccountType
        if (acc.type === 'LDAP') acc.password = null
      } else if (field === 'password') {
        acc.password = value.slice(0, 100)
      } else if (field === 'login') {
        acc.login = value.slice(0, 100)
      }
      this.save()
    },
    validateAccount(acc: Account): boolean {
      let valid = true
      acc.errors = {}

      if (!acc.login.trim()) {
        acc.errors.login = 'Заполните логин'
        valid = false
      }
      if (acc.type === 'Локальная' && (!acc.password || !acc.password.trim())) {
        acc.errors.password = 'Заполните пароль'
        valid = false
      }
      return valid
    }
  }
})
