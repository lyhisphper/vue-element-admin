<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="filter-container">
      <el-input
        :placeholder="$t('member.search')"
        v-model="listQuery.search"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      <el-select
        v-model="listQuery.role"
        :placeholder="$t('member.role_id')"
        clearable
        style="width: 90px"
        class="filter-item">
        <el-option v-for="item in roleOptions" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-select
        v-model="listQuery.country"
        :placeholder="$t('member.country')"
        clearable
        class="filter-item"
        style="width: 130px"
        @click = "getCountry"
        @change = "getProvince"
      >
        <el-option
          v-for="item in countryOptions"
          :key="item.id"
          :label="item.area"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.province"
        :placeholder="$t('member.province')"
        clearable
        class="filter-item"
        style="width: 80px"
        @change = "getCity"
      >
        <el-option
          v-for="item in provinceOptions"
          :key="item.id"
          :label="item.area"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.city"
        :placeholder="$t('member.city')"
        clearable
        class="filter-item"
        style="width: 80px">
        <el-option
          v-for="item in cityOptions"
          :key="item.key"
          :label="item.area"
          :value="item.key"/>
      </el-select>
      <el-date-picker v-model="listQuery.startTime" type="datetime" style="width: 160px;" class="filter-item" placeholder="创建开始时间"/>
      <el-date-picker v-model="listQuery.endTime" type="datetime" style="width: 160px;" class="filter-item" placeholder="创建结束时间"/>
      <br>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="reset">{{ $t('table.reset') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">{{ $t('table.add') }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload">{{ $t('table.export') }}
      </el-button>
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
      <!--{{ $t('table.reviewer') }}-->
    <!--</el-checkbox>-->
    </div>

    <!--// 表格-->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="$t('member.id')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.nickName')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.realname')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.gender')" min-width="150px">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.gender | genderFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.wechat_number')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wechat_number }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.mobile')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.role_id')" width="110px" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.role_id | roleFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.area')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.country }}{{ scope.row.province }}{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.subscribe')" width="110px" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.subscribe | subscribeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.account')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.selfGoodsNum')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.selfGoodsNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.proxyGoodsNum')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.proxyGoodsNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.add_time')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.add_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.subscribe_time')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subscribe_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <!--根据状态显示不同的操作-->
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link to="/member/memberEdit">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          </router-link>
          <el-button
            v-if="scope.row.status!='published'"
            size="mini"
            type="success"
            @click="handleModifyStatus(scope.row,'published')">{{ $t('table.publish') }}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{
          $t('table.draft') }}
          </el-button>
          <el-button
            v-if="scope.row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>

    <!--弹出层-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.type')" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date"/>
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.importance')">
          <el-rate
            v-model="temp.importance"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :max="3"
            style="margin-top:8px;"/>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="temp.remark"
            type="textarea"
            placeholder="Please input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/member'
import { getArea } from '@/api/area'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]
const roleOptions = [
  { key: '1', value: '普通用户' },
  { key: '2', value: '代理商' },
  { key: '3', value: '供应商' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    genderFilter(value) {
      const attrMap = {
        1: '男',
        2: '女'
      }
      return attrMap[value]
    },
    roleFilter(value) {
      const attrMap = {
        1: '普通用户',
        2: '代理商',
        3: '供应商'
      }
      return attrMap[value]
    },
    subscribeFilter(value) {
      const attrMap = {
        1: '是',
        2: '否'
      }
      return attrMap[value]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        search: undefined,
        role: undefined,
        country: undefined,
        province: undefined,
        city: undefined,
        startTime: '',
        endTime: '',
        sort: '+id'
      },
      roleOptions,
      calendarTypeOptions,
      countryOptions: undefined,
      provinceOptions: undefined,
      cityOptions: undefined,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getArea(0, 1)
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data.data
        this.total = response.data.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    reset() {
      this.listQuery.area = ''
      this.listQuery.endTime = ''
      this.listQuery.startTime = ''
      this.listQuery.role = ''
      this.listQuery.search = ''
      // this.countryOptions = [{ 'id': '', 'area': '' }]
      this.listQuery.country = ''
      this.listQuery.province = ''
      this.listQuery.city = ''
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['nickName', 'realname', 'mobile', 'add_time', 'area']
          const filterVal = ['nickName', 'realname', 'mobile', 'timestamp', 'area']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getCountry() {
      this.getArea(0, 1)
    },
    getProvince(item) {
      this.getArea(item, 2)
    },
    getCity(item) {
      this.getArea(item, 3)
    },
    getArea: function(id = 0, type = 1) {
      getArea({ 'id': id }).then(response => {
        if (response.data.data) {
          if (type === 1) {
            this.countryOptions = response.data.data.data
          } else if (type === 2) {
            this.provinceOptions = response.data.data.data
          } else if (type === 3) {
            this.cityOptions = response.data.data.data
          }
        }
      })
    }
  }
}
</script>
