const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const loginCheck = req => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'));
    }
}

const handleBlogRouter = (req, res) => {
    const method = req.method;
    const id = req.query.id;
    
    // 获取列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
        const result = getList(author, keyword);
        return result.then(listData => {
            return new SuccessModel(listData);
        })
    }

    // 获取详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const result = getDetail(id);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }

    // 新建
    if (method === 'POST' && req.path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult;
        }
        req.body.author = req.session.username;
        const result = newBlog(req.body);
        return result.then(data => {
            return new SuccessModel(data);
        })
        
    }

    // 更新
    if (method === 'POST' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult;
        }
        const author = req.session.username;
        const result = updateBlog(id, req.body, author);
        return result.then(data => {
            if (data) {
                return new SuccessModel(data);
            } else {
                return new ErrorModel('更新失败');
            }
        })
    }

    // 删除
    if (method === 'POST' && req.path === '/api/blog/delete') {
        
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult;
        }

        const author = req.session.username;
        const result = delBlog(id, author);
        return result.then(data => {
            if (data) {
                return new SuccessModel(data);
            } else {
                return new ErrorModel('删除失败')
            }
        })
    }
}

module.exports = handleBlogRouter;