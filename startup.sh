#!/bin/bash

if [ ! -d /usr/src/trudesk/public/uploads/users ]; then
    echo "Creating Directory..."
    mkdir /usr/src/trudesk/public/uploads/users
fi

if [ ! -f /usr/src/trudesk/public/uploads/users/defaultProfile.jpg ]; then
    echo "Coping defaultProfile.jpg"
    cp /usr/src/trudesk/public/img/defaultProfile.jpg /usr/src/trudesk/public/uploads/users/defaultProfile.jpg
fi

#node /usr/src/trudesk/runner.js

# Inicia com pm2-runtime (logs vão para stdout/stderr automaticamente)
# --merge-logs é opcional mas ajuda se tiver múltiplos processos
exec pm2-runtime start /usr/src/trudesk/app.js --name trudesk