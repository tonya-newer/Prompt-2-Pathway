# Prompt-2-Pathway-server

## install nodejs

```
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

## install mongodb

```
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update
sudo apt install -y mongodb-org
```

## start mongodb

```
sudo systemctl start mongod
sudo systemctl enable mongod
```

## setup server

```
cd /var/www/
git clone https://github.com/tryexcept0/Prompt-2-Pathway-server.git
cd Prompt-2-Pathway-server
npm install
cp .env.example .env

sudo npm install -g pm2
pm2 start server.js --name prompt-2-pathway-server
pm2 startup systemd
pm2 save
```

## setup frontend

```
cd /var/www/
git clone https://github.com/tryexcept0/Prompt-2-Pathway.git
cd Prompt-2-Pathway
npm install

cp .env.example .env

npm run build
```

## config nginx

```
sudo apt install nginx -y
```

Configure /etc/nginx/sites-available/prompt-2-pathway

```
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    root /var/www/Prompt-2-Pathway/dist;
    index index.html index.htm;

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        alias /var/www/Prompt-2-Pathway-server/uploads/;
    }

    location / {
        try_files $uri /index.html;
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