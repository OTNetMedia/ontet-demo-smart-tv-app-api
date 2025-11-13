# OTNet Smart TV Demo API

### How to run

-   Install mongodb & run it

```
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
```

### Now you can run.

```
node server.js
```

### Test its working at

```
http://localhost:5001/api/game/
```

### Populate some test data.

```
node populate.js
```

### Add a .env file fro aws uploads

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
MONGO_URI=
```
