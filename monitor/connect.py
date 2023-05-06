from odps import ODPS
import sys
import urllib
import os

AccessKey = os.getenv('MONITOR_ACCESS_KEY')
secret = os.getenv('MONITOR_SECRET_KEY')

o = ODPS(AccessKey, secret, 'iacg',endpoint='http://service.cn-shanghai.maxcompute.aliyun.com/api')

insertSql = urllib.parse.unquote(sys.argv[1])
print(insertSql)

o.execute_sql(insertSql)