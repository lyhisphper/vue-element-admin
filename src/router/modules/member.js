/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const memberRouter = {
  path: '/member',
  component: Layout,
  redirect: 'member',
  name: '用户管理',
  meta: { title: '用户管理', icon: 'user', noCache: true },
  children: [
    {
      path: 'index',
      component: () => import('@/views/member/index'),
      name: 'Member',
      meta: { title: '用户列表', icon: 'user', noCache: true }
    },
    {
      path: 'memberEdit',
      component: () => import('@/views/member/memberEdit'),
      hidden: true
    },
    {
      path: 'auth',
      component: () => import('@/views/member/auth'),
      name: 'member',
      meta: { title: '用户认证审核', icon: 'user', noCache: true }
    }
  ]
}

export default memberRouter
