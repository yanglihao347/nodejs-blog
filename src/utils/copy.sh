#!/bin/sh
cd /Users/yanglihao/practice/node-blog/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log

# * 0 * * * sh /Users/yanglihao/practice/node-blog/src/utils/copy.sh