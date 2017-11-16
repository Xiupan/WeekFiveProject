# Deploying a NodeJS Web App on DigitalOcean's Ubuntu Server

I referenced this: https://scotch.io/tutorials/how-to-host-a-node-js-app-on-digital-ocean as I did this but it ain't as easy as the tutorial claims! lol

1. Set up a DigitalOcean Droplet.
2. Set up a SSH key with your DigitalOcean account to connect to it with your computer.
3. Start up the server on DigitalOcean and connect to it via SSH in the Bash Terminal.
  - "ssh root@SERVER_IP_ADDRESS"
4. Now you should be looking at the server's terminal in your local machine terminal. Any further commands will be done on the SERVER.
5. Now we simply git clone down a project's repo.
  - "git clone REPO_URL"
  - "npm install"
  - "npm start"
6. Then in a browser, go to http://YOUR_SERVER_IP:3000 (or whatever port you have configured in the web app)
7. The web app should pop up! If it doesn't, that probably means we have to install Nginx and configure the proxy.
8. Follow this to install Nginx: https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04
9. After that is all done, there seems to be a known bug with restarting nginx on a 1-CPU server or something like that...
10. If you encounter the error: "nginx.service: Failed to read PID from file /run/nginx.pid: Invalid argument" whenever you restart nginx, you must do the workaround:
  - cd all the way to the root of the server
  - "mkdir /etc/systemd/system/nginx.service.d"
  - "printf "[Service]\nExecStartPost=/bin/sleep 0.1\n" > /etc/systemd/system/nginx.service.d/override.conf"
  - "systemctl daemon-reload"
11. Then whenever you restart nginx, it should NOT give you the following error: "nginx.service: Failed to read PID from file /run/nginx.pid: Invalid argument"
12. Now that nginx is working properly, go here: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04#set-up-nginx-as-a-reverse-proxy-server and follow the directions for the Set Up Nginx as a Reverse Proxy Server section. Substitute the 8080 port for whatever port your app will use.
13. Refer back to https://scotch.io/tutorials/how-to-host-a-node-js-app-on-digital-ocean on how to run the app forever. Because once you close the bash terminal without Forever, it will shut down the server.
14. Because we set up a proxy server on DigitalOcean, going to the base server IP address without the port number should go straight to the NodeJS web app. i.e. 123.456.789.123 instead of 123.456.789.123:3000

Yay! We're done :D
