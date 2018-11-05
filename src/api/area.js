import request from '@/utils/request'

export function getArea(id) {
  return request({
    url: '/area/getArea',
    method: 'get',
    params: id
  })
}
