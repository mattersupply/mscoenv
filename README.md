# MSCOENV

Manage your env variables easily.

### Available commands
### - encrypt
Update or create an encrypted env file from your local file in `.env` directory.

```bash
MSCOENV_SECRET_KEY=my-secret-key mscoenv encrypt development
```

For instance: 
Having a dotenv file `.env.development`
```env
MY_ENV_VAR=2
```
It will create a file `.env/development` 

### - decrypt
Decrypt the env desired into a file  `.env.#{enviroment}` in the root directory.

```bash
mscoenv decrypt development
```
