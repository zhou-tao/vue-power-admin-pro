import AdminLayout from '@/layouts/admin/index.vue'
import { AppRouteConfig } from '@/router/types'

const FeatRoute: AppRouteConfig = {
  path: '/feat',
  name: 'feat',
  component: AdminLayout,
  meta: {
    title: '功能',
    icon: 'ri:rocket-2-fill'
  },
  children: [{
    path: 'image-preview',
    name: 'image_preview',
    component: () => import('@/views/admin/feat/image-preview/index.vue'),
    meta: {
      title: '图片预览'
    }
  },
  {
    path: 'lazy',
    name: 'lazy',
    component: () => import('@/views/admin/feat/lazy/index.vue'),
    meta: {
      title: '懒加载'
    }
  },
  {
    path: 'watermark',
    name: 'watermark',
    component: () => import('@/views/admin/feat/watermark/index.vue'),
    meta: {
      title: '水印'
    }
  }]
}

export default FeatRoute