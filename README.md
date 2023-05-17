### Usage instructions

#### Frontend

```bash
cd frontend 
npm install
npm run start
```

Tech lib uses in frontend:

- React
- Redux
- Redux-thunk
- React-router-dom
- Axios
- Material-ui

#### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Tech lib uses in backend:

- Nodejs
- Express
- Mongoose
- Passport
- Bcryptjs
- Jsonwebtoken
- Nodemon

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
    { role: 'dbOwner', db: 'jitera_db' },
  ],
})

```

### Begin
