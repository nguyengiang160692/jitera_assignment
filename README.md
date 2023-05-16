### Usage instructions

#### Frontend

```bash
cd frontend 
npm install
npm run start
```

#### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Create new database

```bash
mongosh

use admin
# Login with your credentials
db.auth('<username>', '<password>')

use jitera_db

db.createUser({
  user: 'jitera_user',
  pwd: 'jitera_password',
  roles: [
    { role: 'readWrite', db: 'jitera_db' },
  ],
})

```

### Begin
