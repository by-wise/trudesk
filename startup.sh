#!/bin/bash

if [ ! -d /usr/src/trudesk/public/uploads/users ]; then
    echo "Creating Directory..."
    mkdir /usr/src/trudesk/public/uploads/users
fi

if [ ! -f /usr/src/trudesk/public/uploads/users/defaultProfile.jpg ]; then
    echo "Coping defaultProfile.jpg"
    cp /usr/src/trudesk/public/img/defaultProfile.jpg /usr/src/trudesk/public/uploads/users/defaultProfile.jpg
fi

if [ ! -d /usr/src/trudesk/logs ]; then
    echo "Creating Logs Directory..."
    mkdir -p /usr/src/trudesk/logs
fi

#node /usr/src/trudesk/runner.js

# Inicia usando o arquivo de ecossistema do PM2 de modo a garantir que todos os logs de
# stdout e stderr sejam gravados em logs/output.log, tornando a tela de logs administrativa funcional.
exec pm2-runtime start ecosystem.config.js
