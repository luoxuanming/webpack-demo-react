import http from '@/utils/request'

export const homeApi = {
  getList: (params) => http.get('/home/list', params),
  getDetail: (id) => http.get(`/home/detail/${id}`),
}