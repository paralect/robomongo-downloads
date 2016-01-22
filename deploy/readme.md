## Robomongo downloads deployment



### Prerequisites

1. Ansible 1.9 or higher is required

### Installing roles dependencies

```
cd deploy
sudo ansible-galaxy install -r requirements.txt -f
```

### Configuring new server(s)

Setup server (typically need only once, for a newly created server):
```
./bin/setup-server.sh -i app/staging -e "env=production"
```

Redeploy nginx alone:

```
./bin/setup-server.sh -i app/staging --tags "nginx" -e "env=production"
```

## Deploy application

```
./bin/deploy-app.sh -i app/staging -e "env=production"
```
