# MegaMart demo data

With the Docker Compose stack running, execute:

```powershell
npm run seed-demo
```

This loads 6 categories and 24 demo products plus inventory, prices, ratings, media, and the `WELCOME10` promotion. The command also clears Redis search cache.

Open `http://localhost:8080` and try searches such as `sports`, `electronics`, `fashion`, or `devops`.
