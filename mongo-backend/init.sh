# init.sh
set -e
mongosh <<EOF
use admin

db.createUser({
  user: 'dbadmin',
  pwd:  'password',
  roles: [{
    role: 'readWrite',
    db: 'main'
  }]
})
EOF