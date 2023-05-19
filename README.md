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
- Redux-thunk (To make the process of asynchronous data flow easier)
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

- nvm (node version management) => require node vereion 18
- Nodejs
- Express
- Mongoose
- Joi (for validation input data)
- Passport
- Bcryptjs (Hash & salt)
- Jsonwebtoken
- Nodemon (develop process)

Create new database

```bash
mongosh

# authentication source in admin database, default is admin
use admin
# Login with your credentials
db.auth('<username>', '<password>')

db.createUser({
  user: 'jitera_user',
  pwd: 'jitera_password',
  roles: [
    { role: 'dbOwner', db: 'jitera_db' },
  ],
})

use jitera_db
```

### Begin
