# Prompt-2-Pathway

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Server configuration

### install nodejs

```
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

### install mongodb

```
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update
sudo apt install -y mongodb-org
```

### start mongodb

```
sudo systemctl start mongod
sudo systemctl enable mongod
```

### setup server & frontend

```
cd /var/www/
git clone https://github.com/shrec-dad/Prompt-2-Pathway.git

npm install
cp .env.example .env
npm run build

cd server
npm install
cp .env.example .env

sudo npm install -g pm2
pm2 start server.js --name prompt-2-pathway-server
pm2 startup systemd
pm2 save
```

## config nginx

```
sudo apt install nginx -y
```

Configure /etc/nginx/sites-available/prompt-2-pathway

```
server {
    listen 80;
    server_name prompt2pathway.com www.prompt2pathway.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name prompt2pathway.com www.prompt2pathway.com;

    ssl_certificate     /etc/letsencrypt/live/prompt2pathway.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/prompt2pathway.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/Prompt-2-Pathway/dist;
    index index.html index.htm;

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;


        if ($request_method = OPTIONS) {
            add_header Access-Control-Allow-Origin $http_origin;
            add_header Access-Control-Allow-Credentials true;
            add_header Access-Control-Allow-Methods 'GET, POST, PUT, PATCH, DEL>
            add_header Access-Control-Allow-Headers 'Content-Type, Authorizatio>
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }

        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Credentials true always;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
        add_header Access-Control-Allow-Headers 'Content-Type, Authorization, X-Requested-With' always;
    }

    location /uploads/ {
        alias /var/www/Prompt-2-Pathway/server/uploads/;
        autoindex off;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    client_max_body_size 100M;
}
```

```
sudo ln -s /etc/nginx/sites-available/prompt-2-pathway /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## enable firewall

```
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```
