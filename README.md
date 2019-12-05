# HOW TO INSTALL

Import sql file in this root directory to your database but this app can automatically generate if table is not exists in your database when it run.

```bash
yarn install
```

For development

```bash
yarn dev
```

For build

```bash
yarn start
```

# CONFIGURATION

1. Create .env file in root folder
2. Add this in .env file and change with your database configuration 

```bash
HOST="your database host"
USER="your database user"
PASSWORD="your database password"
DATABASE="your database name"
```