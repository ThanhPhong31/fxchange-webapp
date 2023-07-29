import RBAC from 'easy-rbac'

const rbac = new RBAC({
  admin: {
    can: [''],
  },
})
