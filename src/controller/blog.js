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
    
    const sql = `select id,title,content,author,createtime from blogs where id=${id}`;

    return exec(sql).then(rows => {
        return rows[0];
    });
}

const newBlog = (blogData = {}) => {
    const { title, content, author } = blogData;
    const createtime = Date.now();

    const sql = `insert into blogs (title, content, author, createtime) values ('${title}','${content}','${author}',${createtime})`;
    return exec(sql).then(insertResult => {
        return { id: insertResult.insertId };
    });
}

const updateBlog = (id, blogData = {}, author) => {
    const { title, content } = blogData;
    const sql = `update blogs set title='${title}',content='${content}' where id=${id} and author='${author}'`;
    return exec(sql).then(updateResult => {
        if(updateResult.affectedRows > 0) {
            return { id };
        }
        return false;
    })
}

const delBlog = (id, author) => {
    
    const sql = `delete from blogs where id=${id} and author='${author}'`;

    return exec(sql).then(delResult => {
        if(delResult.affectedRows > 0) {
            return { id };
        }
        return false;
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}