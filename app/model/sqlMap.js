/**
 * 分页查询
 * @param {Object} pageParams 分页参数的条件
 * @param {Object} query 分页总数的条件
 * @param {Object} app  app实例
 */
async function queryLimit(pageParams, query, tableName = 'user', app) {
    // 如果没有页码 就默认值给1
    !pageParams.pageNum && (pageParams.pageNum = 1);
    //没有1页多少条的树木 就默认值给10条
    !pageParams.pageSize && (pageParams.pageSize = 10);

    const { pageNum, pageSize } = pageParams;
   
    /**
       * 分页查询
       * @param offset 起始页
       * @param limit 每页展示条数
       * offset=page*limit-limit
       */
    const page = {
        offset: Math.floor(pageNum) * Math.floor(pageSize) - Math.floor(pageSize),
        limit: Math.floor(pageSize)
    }
    //
    let str = ''
    str = Object.keys(query)
        .reduce((prev, cur, index) => {
            if (!prev) {
                prev = ` where ${cur}=?`
            } else {
                prev += ` ${cur}=?`
            }
            return prev
        }, '')
    const list = await app.mysql.select(tableName, Object.assign(page, query));
    //聚合查询总数
    const count = await app.mysql.query(
        `select COUNT(id) from ${tableName}` + str,
        Object.values(query)
    )
    //总数
    const total = count[0]['COUNT(id)'];
    //总页数
    const pages = Math.ceil(total / pageSize);
    //当前页数
    const currentPage = pageNum;

    return {
        list,
        total,
        pages,
        currentPage
    }
}
/**
 * 删除接口
 * @param {String} ids 删除的id的合计
 * @param {String} tableName 表名
 * @param {Object} app app的实例
 * @returns 
 */
async function del(ids,tableName, app) {
    const result = await app.mysql.query(
        `DELETE FROM ${tableName} where id IN (${ids})`);
    return result;
}
/**
 * 根据id查询信息
 * @param {String} id 需要查询信息的id
 * @param {String} tableName 表名
 * @param {Object} app app实例
 */
async function queryInfoById(id,tableName,app){
    const info = await app.mysql.get(tableName, {
        id
    })
    return info
}
module.exports = {
    queryLimit,
    del,
    queryInfoById
}
