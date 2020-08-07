const { exec } = require('../db/mysql');

const getList = (author, keyword) => {
    let sql = `select id,title,content,author,createtime from blogs where 1=1 `;
    if (author) {
        sql += `and author='${author}' `;
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `;
    }
    sql += `order by createtime desc`;

    return exec(sql);
}

const getDetail = (id) => {
    
    let sql = `select id,title,content,author,createtime from blogs where id=${id}`;

    return exec(sql).then(rows => {
        return rows[0];
    });
}

const newBlog = (blogData = {}) => {
    return {
        id: 1,
    }
}

const updateBlog = (id, blogData = {}) => {
    return {
        id: 1,
    }
}

const delBlog = (id) => {
    return {
        id: 1
    }
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}