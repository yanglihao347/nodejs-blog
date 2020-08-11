const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { set, get } = require('./src/db/redis');

const getPostData = req => {
  const promise = new Promise((resolve, reject) => {

    if (req.method !== 'POST') {
      resolve({});
      return;
    }

    if (req.headers['content-type'] !== 'application/json') {
      resolve({});
      return;
    }

    let postData = '';
    req.on('data', chunk => {
      postData += chunk.toString();
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return;
      }
      resolve(JSON.parse(postData));
    })
  })
  return promise;
}

const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  return d.toGMTString();
}

const parseCookie = req => {
  const cookieStr = req.headers.cookie || '';
  const cookies = {};
  const arr = cookieStr.split(';');
  arr.forEach(cookie => {
    if (!cookie) {
      return;
    }
    cookies[cookie.split('=')[0]] = cookie.split('=')[1];
  })
  return cookies;
}

const serverHandle = (req, res) => {
  res.setHeader('content-type', 'application/json');

  const url = req.url;
  req.path = url.split('?')[0];
  req.query = querystring.parse(url.split('?')[1]);
  req.cookie = parseCookie(req);

  let userId = req.cookie.userid;
  let needSetCookie = false;
  if (!userId) {
    userId = `${Date.now()}_${Math.random()}`;
    needSetCookie = true;
  }
  get(userId).then(sessionData => {
    req.sessionId = userId;
    if(!sessionData) {
      set(userId, {});
      req.session = {};
    } else {
      req.session = sessionData;
    }
    return getPostData(req);
  }).then((postData) => {
    req.body = postData;

    // 处理blog路由
    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
        }
        res.end(JSON.stringify(blogData));
      });
      return;
    }

    // 处理user路由
    const userResult = handleUserRouter(req, res);
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
        }
        res.end(JSON.stringify(userData))
      })
      return;
    }

    // 未命中路由，返回404
    res.writeHead(404, {
      "Content-type": "text/plain"
    });
    res.write('404 Not Found\n');
    res.end();

  })

}

module.exports = serverHandle;