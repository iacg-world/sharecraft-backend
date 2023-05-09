from odps import ODPS
import sys
import urllib
from dotenv import dotenv_values

env_variables = dotenv_values('../.env')
AccessKey = env_variables['MONITOR_ACCESS_KEY']
secret = env_variables['MONITOR_SECRET_KEY']

o = ODPS(AccessKey, secret, 'iacg',endpoint='http://service.cn-shanghai.maxcompute.aliyun.com/api')

insertSql = urllib.parse.unquote(sys.argv[1])
print(insertSql)

o.execute_sql(insertSql)